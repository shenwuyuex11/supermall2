// 初始加载的arcgis api 模块
export const gisModules = [
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/WebTileLayer',
  'esri/layers/support/TileInfo',
  'esri/config',
  'esri/geometry/Point',
  'esri/Graphic',
  'esri/widgets/ScaleBar',
  "esri/tasks/FindTask",
  "esri/tasks/support/FindParameters",
  "esri/symbols/FillSymbol",
  "esri/geometry/Polygon",
  "esri/layers/GraphicsLayer",
  "esri/geometry/Point",
  "esri/geometry/Extent",
  "esri/symbols/MarkerSymbol",
  "esri/layers/FeatureLayer",
  "esri/tasks/QueryTask", 
  "esri/tasks/support/Query",
  'dojo/domReady!'
];

//findTask 使用的地图服务地址
export const mapServerUrl = 'http://localhost:6080/arcgis/rest/services/Edit/editPolygon/MapServer';

//展示到底图上的图层
// export const featureUrl = 'http://localhost:6080/arcgis/rest/services/Edit/editPolygon/FeatureServer';

//数据展示用的图层
export const showServerUrl = 'http://localhost:6080/arcgis/rest/services/Edit/editPoint/FeatureServer/0';