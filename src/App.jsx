import { useState } from "react";
import AmapMap from "./AmapMap";
import "./index.css";
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY;
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE;


// 地点数据：新增地点时，在这里添加一项
// markerColor 可选：white / pink / green / black
// 双色示例：pink-green / pink-black / white-green

const locations = [
 
{
  id: 1,
  name: "澳门舞伎抹茶（大三巴分店）",
  category: "应援咖啡厅",
  address: "澳门特别行政区花王堂区大三巴街凤凰大厦地下23E",
  date: "2026.10.30 - 11.02",
  openingHours: "10:00 - 20:00",
  description: "BAMBY斑比澳门个人应援｜READY? SET? GO! 🏁💨 💗 BAMBY欢迎抵达澳门！大三巴分店限量300份。应援物料包括手幅、纸袋、人生四格、明信片等，送完即止。领取要求：关注@DeerBamby0715。",
  image: "/images/2.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/4zcDbABf9jY",
  position: [22.193646, 113.54592],
  markerColor: "pink",
},
{
  id: 2,
  name: "银河二期及百老汇大街特别配送餐车",
  category: "应援活动",
  address: "中国澳门特别行政区路凼填海区银河二期及百老汇大街",
  date: "2026.10.31 - 11.01",
  openingHours: "11:00 - 22:00",
  description: "BAMBY斑比澳门个人应援｜特别配送餐车。限量400份，与大三巴分店合计700份。应援物料包括手幅、纸袋、人生四格、明信片等，送完即止。领取要求：关注@DeerBamby0715。",
  image: "/images/2.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/4zcDbABf9jY",
  position: [22.143656, 113.556656],
  markerColor: "pink",
},

{
  id: 3,
  name: "旺记咖啡｜澳门蔡斑比三店应援",
  category: "应援咖啡厅",
  address: "澳门氹仔官也街1号",
  date: "2026.10.30 - 11.02",
  openingHours: "",
  description: "澳门蔡斑比三店应援。领取条件请查看应援海报；请提前截图并向店员出示，每人限领1份。",
  image: "/images/3.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/1bu0PmK5KzY",
  position: [22.15019, 113.562234],
  markerColor: "pink",
},
{
  id: 4,
  name: "Photoism｜澳门蔡斑比三店应援",
  category: "应援活动",
  address: "澳门路凼城路凼填海区澳门凼仔告利雅施利华街39号",
  date: "2026.10.30 - 11.02",
  openingHours: "",
  description: "澳门蔡斑比三店应援。领取条件请查看应援海报；请提前截图并向店员出示，每人限领1份。",
  image: "/images/3.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/1bu0PmK5KzY",
  position: [22.149925, 113.562205],
  markerColor: "pink",
},
{
  id: 5,
  name: "鲜果檬檬｜澳门蔡斑比三店应援",
  category: "应援饮品店",
  address: "澳门氹仔告利雅施利华街39号地下",
  date: "2026.10.30 - 11.02",
  openingHours: "",
  description: "澳门蔡斑比三店应援。领取条件请查看应援海报；请提前截图并向店员出示，每人限领1份。",
  image: "/images/3.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/1bu0PmK5KzY",
  position: [22.194489, 113.551575],
  markerColor: "pink",
},

{
  id: 6,
  name: "暖暮拉面｜HAMIN河玟生日花墙应援",
  category: "应援拉面店",
  address: "澳门氹仔胡琴巷13A至15A号",
  date: "2026.10.31 - 11.01",
  openingHours: "11:00 - 22:00",
  description: "🇲🇴 HAMIN河玟生日应援 应援店＋花墙打卡。花墙24小时开放打卡。三楼PLLI ZONE开放时间：2026年10月31日11:00-22:00。官也街步行约3分钟。",
  image: "/images/4.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/5Ho02Yg4hMu",
  position: [22.151318, 113.564156],
  markerColor: "green",
},

{
  id: 7,
  name: "SOFU Patisserie｜HAMIN生日应援Part.1",
  category: "应援甜品店",
  address: "澳门氹仔官也街山治美兰打前地12号",
  date: "2026.10.30 - 11.01",
  openingHours: "10:30 - 20:30",
  description: "柳河玟澳门生日应援 Part.1｜SOFU Patisserie包店应援。位置提示：钜记手信和凼仔街市中间进去。",
  image: "/images/5.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/9Blj2Qnk7se",
  position: [22.150889, 113.561513],
  markerColor: "green",
},

{
  id: 8,
  name: "海底捞｜HAMIN生日应援Part.2",
  category: "应援餐厅",
  address: "澳门特别行政区望德圣母湾大马路威尼斯人购物中心1036A铺海底捞",
  date: "2026.10.31 - 11.01",
  openingHours: "",
  description: "柳河玟澳门生日应援 Part.2｜海底捞生日应援。欢迎到场用餐及打卡。",
  image: "/images/6.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/3Ad3LDnSvxD",
  position: [22.142759, 113.57092],
  markerColor: "green",
},

{
  id: 9,
  name: "威尼斯人花墙｜HAMIN生日应援Part.3",
  category: "生日花墙",
  address: "澳门特别行政区望德圣母湾大马路威尼斯人购物中心1036A铺海底捞门口",
  date: "2026.10.30 - 11.01",
  openingHours: "花墙投放期间开放，具体时段以现场安排为准",
  description: "柳河玟澳门生日应援 Part.3｜威尼斯人花墙。",
  image: "/images/7.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/4tBLetZ3YOv",
  position: [22.144386, 113.565506],
  markerColor: "green",
},

{
  id: 10,
  name: "HAMIN河玟澳门个人生日应援大屏",
  category: "生日应援大屏",
  address: "澳门路凼溜冰路英皇戏院（澳门葡京人）西南约222米",
  date: "2026.11.01",
  openingHours: "09:00 - 21:00",
  description: "柳河玟澳门个人生日应援大屏🇲🇴。播放频率：每次15秒，共130次。屏幕位置：路凼溜冰路，英皇戏院（澳门葡京人）西南约222米。",
  image: "/images/8.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/5iXWEJ7AhvX",
  position: [22.137592, 113.579824],
  markerColor: "green",
},

{
  id: 11,
  name: "HAMIN澳门葡京人大屏应援",
  category: "联合应援大屏",
  address: "澳门路凼溜冰路英皇戏院（澳门葡京人）西南约222米",
  date: "2026.11.01",
  openingHours: "09:00 - 21:00",
  description: "YELINE & HAMIN澳门葡京人大屏联合应援。每日播放频率：15秒/次，共130次。",
  image: "/images/9.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/8PMPaQToN2S",
  position: [22.137592, 113.579824],
  markerColor: "green",
},

{
  id: 12,
  name: "澳门伦敦人综艺馆",
  category: "演出场馆",
  address: "澳门路氹伦敦人综艺馆",
  date: "",
  openingHours: "",
  description: "PLAVE澳门演出场馆。建议提前确认演出入场时间、交通安排及现场公告。",
  image: "/images/10.jpg",
  xiaohongshuUrl: "",
  position: [22.143905, 113.570948],
  markerColor: "black",
},
{
  id: 13,
  name: "茶百道（官也街店）｜PLAVE澳门世巡联合应援",
  category: "应援饮品店",
  address: "澳门特别行政区嘉模堂区氹仔木铎街41号地下",
  date: "2026.10.31 - 11.01",
  openingHours: "10:00 - 21:00",
  description: "消费对应餐饮可领取应援礼。应援礼：手幅、杯套、贴纸、纸袋、仿拍立得小卡。",
  image: "/images/1.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/7lMnbL2OtME",
  position: [22.15032, 113.562123],
  markerColor: "white",
},
{
  id: 14,
  name: "天青茗度｜PLAVE澳门世巡联合应援",
  category: "应援饮品店",
  address: "澳门特别行政区嘉模堂区奥林匹克大马路与成都街交叉口东南286米",
  date: "2026.10.31 - 11.01",
  openingHours: "11:00 - 20:30",
  description: "饮品＋曲奇套餐70 MOP。应援礼：明信片、A4海报、打卡透卡、贴纸。",
  image: "/images/11.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/7lMnbL2OtME",
  position: [22.150827, 113.563449],
  markerColor: "white",
},
{
  id: 15,
  name: "澳门伦敦人综艺馆｜PLAVE团体打卡",
  category: "团体应援打卡",
  address: "澳门伦敦人综艺馆五楼 Door B 旁",
  date: "2026.10.31 - 11.01",
  openingHours: "",
  description: "PLAVE澳门世巡团体应援打卡点。现场设有PLAVE团体立牌及易拉宝。",
  image: "/images/12.jpg",
  xiaohongshuUrl: "",
  position: [22.143905, 113.570948],
  markerColor: "white",
},
{
  id: 16,
  name: "whatelephant coffee&desserts｜PLAVE澳门应援咖啡店",
  category: "应援咖啡厅",
  address: "澳门氹仔嘉模堂区兵房斜巷8号立民楼地下A铺",
  date: "2026.10.30 - 11.01",
  openingHours: "11:00 - 18:30",
  description: "官也街应援咖啡店，设有专属周边套餐、定制曲奇及沉浸式痛店打卡体验。打卡有礼。",
  image: "/images/13.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/6WyqosdzT4n",
  position: [22.150272, 113.562967],
  markerColor: "white",
},
{
  id: 17,
  name: "澳门威尼斯人综艺馆｜演出票领取处",
  category: "演出票领取",
  address: "澳门威尼斯人度假村西翼大堂",
  date: "",
  openingHours: "具体时间以官方公告为准",
  description: "威尼斯人现场另设有PLAVE官方打卡海报。取票时间仅供参考，请以官方公告及现场安排为准。",
  image: "/images/14.jpg",
  xiaohongshuUrl: "",
  position: [22.144864, 113.567746],
  markerColor: "black",
},
{
  id: 18,
  name: "澳门伦敦人综艺馆｜演出票领取处",
  category: "演出票领取",
  address: "澳门伦敦人酒店四楼综艺馆入口",
  date: "",
  openingHours: "具体时间以官方公告为准",
  description: "演出当天可在此领取门票；此前取票安排于威尼斯人，演出当天伦敦人综艺馆开放取票。取票时间仅供参考，请以官方公告及现场安排为准。",
  image: "/images/15.jpg",
  xiaohongshuUrl: "",
  position: [22.143905, 113.570948],
  markerColor: "black",
},
{
  id: 19,
  name: "DIGREEN｜YELINE澳门主题店应援",
  category: "主题应援店",
  address: "澳门伦敦人购物中心2楼SKT14铺 DIGREEN",
  date: "2026.10.31 - 11.01",
  openingHours: "11:00 - 21:00",
  description: "🌊 YELINE主题店应援 in Macau 🐈‍⬛𓈒𓏸🕸️。活动日期：2026年10月31日至11月1日。地点：澳门伦敦人购物中心2楼SKT14铺 DIGREEN。欢迎前来打卡。",
  image: "/images/16.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/4TzDEU8awf4",
  position: [22.142876, 113.570373],
  markerColor: "green-Blue",
},
{
  id: 20,
  name: "YELINE｜澳门葡京人大屏应援",
  category: "生日应援大屏",
  address: "澳门路凼溜冰路英皇戏院（澳门葡京人）西南约222米",
  date: "2026.11.01",
  openingHours: "09:00 - 21:00",
  description: "亮屏时间：2026年11月1日09:00-21:00。每日播放频率：15秒/次，共130次。",
  image: "/images/17.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/8PMPaQToN2S",
  position: [22.137592, 113.579824],
  markerColor: "green-blue",
},
{
  id: 21,
  name: "YELINE｜澳门花墙应援 Part.1",
  category: "生日花墙",
  address: "澳门伦敦人综艺馆二楼商场人行通道",
  date: "2026.10.31 - 11.01",
  openingHours: "",
  description: "YELINE澳门花墙应援。地点位于演唱会场馆伦敦人二楼商场人行通道。请遵守商场秩序，共同保证活动顺利进行。",
  image: "/images/18.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/79SWsQ62iqc",
  position: [22.143905, 113.570948],
  markerColor: "green-blue",
},
{
  id: 22,
  name: "HaminNoah｜澳门演唱会包店花墙应援",
  category: "联合应援咖啡厅",
  address: "澳门路氹连贯公路新濠影汇一楼1081铺 Cuppa Coffee",
  date: "2026.10.31 - 11.01",
  openingHours: "08:00 - 19:30",
  description: "HaminNoah｜澳门演唱会包店花墙应援初宣。EVENT 1：店门口花墙应援，尺寸约4m × 2.2m。EVENT 2：Cuppa Coffee包店应援。地点：澳门路氹连贯公路新濠影汇一楼1081铺。营业时间：2026年10月31日至11月1日，每日08:00-19:30。",
  image: "/images/19.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/22dDeaN7aYQ",
  position: [22.1377, 113.566466],
  markerColor: "green-purple",
},
{
  id: 23,
  name: "BrownStudyBakery｜椰奶CP澳门应援咖",
  category: "CP应援咖啡厅",
  address: "澳门氹仔米亚马嘉礼前地1-7号独栋（小飞象斜对面，澳门抹茶旁）",
  date: "2026.10.31",
  openingHours: "11:00 - 19:00",
  description: "购买套餐+浓度自证，饮品+曲奇 70rmb，共100份领完即止。",
  image: "/images/20.jpg",
  xiaohongshuUrl: "https://xhslink.cn/o/1Y94c6PWyjM",
  position: [22.150569, 113.561605],
  markerColor: "blue-purple",
},
];

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <main className="app">
      {/* 顶部横幅 */}
      <header className="event-banner">
        <img
          src="/images/event-banner.jpg"
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="banner-placeholder">
          <span>PLLI GUIDE</span>
          <h1>PLAVE IN MACAO</h1>
          <p>澳门应援打卡地图 · FAN CHECK-IN MAP</p>
        </div>
      </header>

      {/* 地图标题与颜色图例 */}
      <section className="map-heading">
        <div className="map-heading-title">
          <h2>打卡地点</h2>
          <p>点击地图标记，查看地点详情</p>
        </div>

        <div className="map-legend">
          <span className="legend-item">
            <i className="legend-dot legend-white" />
            团体
          </span>

          <span className="legend-item">
            <i className="legend-dot legend-pink" />
            斑比
          </span>

          <span className="legend-item">
            <i className="legend-dot legend-green" />
            河玟
          </span>

          <span className="legend-item">
            <i className="legend-dot legend-black" />
            演出场馆
          </span>

          <span className="legend-item">
            <i className="legend-dot legend-rainbow" />
            CP
          </span>
        </div>

        <span className="location-count">
          {locations.length} PLACES
        </span>
      </section>

      {/* 高德地图与地点详情 */}
      <section className="map-section">
        <AmapMap
          locations={locations}
          onSelectLocation={setSelectedLocation}
          selectedLocation={selectedLocation}
        />

        {/* 地点详情卡片 */}
        {selectedLocation && (
          <div className="location-card">
            <button
              className="close-button"
              onClick={() => setSelectedLocation(null)}
              aria-label="关闭详情"
            >
              ×
            </button>

            {selectedLocation.image && (
              <img
                className="location-image"
                src={selectedLocation.image}
                alt={selectedLocation.name}
              />
            )}

            <div className="location-content">
              <span className="location-category">
                {selectedLocation.category}
              </span>

              <h3>{selectedLocation.name}</h3>

              <p className="location-info">
                <strong>地址</strong>
                {selectedLocation.address}
              </p>

              <p className="location-info">
                <strong>活动时间</strong>
                {selectedLocation.date || "请查看活动公告"}
              </p>

              <p className="location-info">
                <strong>营业时间</strong>
                {selectedLocation.openingHours || "请查看活动公告"}
              </p>

              <p className="location-description">
                {selectedLocation.description}
              </p>

              
<a
  className="amap-navigation-button"
  href={`https://uri.amap.com/marker?position=${selectedLocation.position[1]},${selectedLocation.position[0]}&name=${encodeURIComponent(selectedLocation.name)}&src=PLLI_GUIDE&coordinate=gaode&callnative=1`}
  target="_blank"
  rel="noopener noreferrer"
>
  <span>高德地图导航</span>
  <span>↗</span>
</a>

{selectedLocation.xiaohongshuUrl && (
  <a
    className="xiaohongshu-button"
    href={selectedLocation.xiaohongshuUrl}
    target="_blank"
    rel="noopener noreferrer"
  >
    原帖指路 ↗
  </a>
)}

            </div>
          </div>
        )}
      </section>

      <footer className="page-footer">
        PLAVE IN MACAO
      </footer>
    </main>
  );
}

export default App;
