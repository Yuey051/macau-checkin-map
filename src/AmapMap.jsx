
import { useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY;
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE;

// 地图标记颜色
const COLORS = {
  white: "#FFFFFF",
  pink: "#F3A6C8",
  green: "#9BC9A8",
  black: "#252525",
  red: "#F05B65",
  blue: "#78A9F5",
  purple: "#B99AE8",
};

// 创建标记外观，支持单色和双色
function createMarkerContent(number, markerColor = "pink") {
  const parts = markerColor.toLowerCase().split("-");

  const color1 = COLORS[parts[0]] || COLORS.pink;
  const color2 = COLORS[parts[1]] || color1;

  const background =
    parts.length > 1
      ? `linear-gradient(to right, ${color1} 50%, ${color2} 50%)`
      : color1;

  const textColor =
    parts.length === 1 && parts[0] === "white"
      ? "#252525"
      : "#FFFFFF";

  const borderColor = parts.includes("white")
    ? "#D8D8D8"
    : "#FFFFFF";

  return `
    <div style="
      width:36px;
      height:36px;
      display:flex;
      align-items:center;
      justify-content:center;
      box-sizing:border-box;
      border:2px solid ${borderColor};
      border-radius:50%;
      background:${background};
      color:${textColor};
      font-size:13px;
      font-weight:800;
      box-shadow:0 3px 10px rgba(0,0,0,.25);
    ">${number}</div>
  `;
}

// 计算两个坐标之间的距离，单位为米
function getDistanceMeters(position1, position2) {
  const [lat1, lng1] = position1;
  const [lat2, lng2] = position2;

  const toRadians = (degree) => (degree * Math.PI) / 180;
  const earthRadius = 6371000;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return (
    earthRadius *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

// 将坐标相同或相距较近的点位分组，
// 只调整地图上的像素偏移，不修改真实坐标
function calculateMarkerOffsets(locations) {
  const groups = [];
  const thresholdMeters = 35;

  locations.forEach((location, index) => {
    const position = location.position;

    let group = groups.find((item) =>
      getDistanceMeters(item.anchor, position) < thresholdMeters
    );

    if (!group) {
      group = {
        anchor: position,
        indexes: [],
      };
      groups.push(group);
    }

    group.indexes.push(index);
  });

  const offsets = locations.map(() => ({
    x: 0,
    y: 0,
  }));

  groups.forEach((group) => {
    const count = group.indexes.length;

    // 单独的点位不移动
    if (count === 1) return;

    // 点位越多，排列半径适当增大
    const radius = Math.max(32, (count * 36) / (2 * Math.PI));

    group.indexes.forEach((locationIndex, order) => {
      const angle =
        -Math.PI / 2 + (2 * Math.PI * order) / count;

      offsets[locationIndex] = {
        x: Math.round(Math.cos(angle) * radius),
        y: Math.round(Math.sin(angle) * radius),
      };
    });
  });

  return offsets;
}

export default function AmapMap({
  locations = [],
  onSelectLocation,
  selectedLocation,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const selectRef = useRef(onSelectLocation);
  const [error, setError] = useState("");

  useEffect(() => {
    selectRef.current = onSelectLocation;
  }, [onSelectLocation]);

  useEffect(() => {
    let cancelled = false;
    let mapInstance = null;

    async function initializeMap() {
      try {
        setError("");

        if (!AMAP_KEY || !AMAP_SECURITY_CODE) {
          throw new Error(
            "没有读取到高德 Key 或安全密钥。请检查项目根目录的 .env.local 文件，并重启 Vite。"
          );
        }

        window._AMapSecurityConfig = {
          securityJsCode: AMAP_SECURITY_CODE,
        };

        const AMap = await AMapLoader.load({
          key: AMAP_KEY,
          version: "2.0",
        });

        if (cancelled || !containerRef.current) return;

        mapInstance = new AMap.Map(containerRef.current, {
          viewMode: "2D",
          zoom: 13,
          center: [113.5439, 22.1987],
          resizeEnable: true,
        });

        mapRef.current = mapInstance;

        // 先过滤无效坐标，再计算重叠点位的偏移
        const validLocations = locations.filter(
          (location) =>
            Array.isArray(location.position) &&
            location.position.length === 2 &&
            location.position.every(
              (value) =>
                typeof value === "number" &&
                Number.isFinite(value)
            )
        );

        const offsets = calculateMarkerOffsets(validLocations);

        const markers = validLocations.map((location, index) => {
          const [latitude, longitude] = location.position;
          const offset = offsets[index];

          const marker = new AMap.Marker({
            // 实际坐标保持不变
            position: [longitude, latitude],

            content: createMarkerContent(
              index + 1,
              location.markerColor || "pink"
            ),

            // 仅调整标记的显示位置，避免彼此遮挡
            offset: new AMap.Pixel(
              -18 + offset.x,
              -18 + offset.y
            ),

            title: location.name,
            zIndex: 100 + index,
          });

          marker.on("click", () => {
            selectRef.current?.(location);
          });

          return marker;
        });

        if (markers.length > 0) {
          mapInstance.add(markers);
          mapInstance.setFitView(
            markers,
            false,
            [55, 55, 55, 55]
          );

          if (markers.length === 1) {
            mapInstance.setZoom(16);
          }
        }
      } catch (err) {
        console.error("高德地图初始化失败：", err);

        if (!cancelled) {
          setError(
            err?.message ||
              "高德地图加载失败。请按 F12 查看 Console 中的错误信息。"
          );
        }
      }
    }

    initializeMap();

    return () => {
      cancelled = true;

      if (mapInstance) {
        mapInstance.destroy();
      }

      if (mapRef.current === mapInstance) {
        mapRef.current = null;
      }
    };
  }, [locations]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !selectedLocation?.position) return;

    const [latitude, longitude] = selectedLocation.position;

    // 详情和定位仍使用原始坐标
    map.setZoomAndCenter(16, [longitude, latitude]);
  }, [selectedLocation]);

  return (
    <div className="amap-map-wrapper">
      <div
        ref={containerRef}
        className="amap-map"
        aria-label="PLAVE 澳门应援打卡地图"
      />

      {error && (
        <div className="amap-map-error">
          <strong>高德地图暂时无法显示</strong>
          <p>{error}</p>
          <p>
            请检查高德 Key、安全密钥、应用配置及浏览器控制台报错。
          </p>
        </div>
      )}
    </div>
  );
}
