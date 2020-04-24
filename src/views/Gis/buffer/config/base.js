import {
  loadCss,
  loadModules,
  setDefaultOptions,
  /*setDefalutOptions*/
} from 'esri-loader';
import tileInfo from './tileInfo';
import {
  gisModules,
  hotelsFeatureLayerUrls,
  symbols
} from './config';
/*加载特定版本的API*/
// setDefaultOptions({version: 'next'})

export default {
  name: 'BaseMap',
  data() {
    return {
      type: false,
      gisConstructor: {}, //gis 构造函数
      gisInstance: {}, // gis 实例
      layerID: {},
      layersInstance: {},
      gisModules: gisModules,
      view: {},
      findResults: [],
      findResultsGeo: [],
      graphic: {}
    }
  },
  components: {},
  mounted() {
    this.init();
  },
  methods: {
    //初始化地图界面
    init() {
      // 加载css
      loadCss();
      // 加载模块
      loadModules(this.gisModules).then(this.loadMap);
    },
    loadMap(args) {
      // 作为 map 容器的标签
      let container = this.$refs.viewDiv;

      /*处理构造函数，绑定到gisConstructor,方便组件内其他函数调用gis api 的模块*/
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop();
        this.gisConstructor[name] = args[k];
      }

      const pointsFeatureLayer = new this.gisConstructor.FeatureLayer({
        url: hotelsFeatureLayerUrls[0].Url,
        mode: this.gisConstructor.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"],
        popupEnabled: false,
        id: "incidentsPoints"
      });

      const linesFeatureLayer = new this.gisConstructor.FeatureLayer({
        url: hotelsFeatureLayerUrls[1].Url,
        mode: this.gisConstructor.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"],
        popupEnabled: false,
        id: "incidentsLines"
      });

      const ringsFeatureLayer = new this.gisConstructor.FeatureLayer({
        url: hotelsFeatureLayerUrls[2].Url,
        mode: this.gisConstructor.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"],
        popupEnabled: false,
        id: "incidentsRings"
      });

      /*初始化各种图层*/
      let cva_c = this.initYiledLayer('cva_c'); //矢量注记
      let vec_c = this.initYiledLayer('vec_c'); //矢量底图

      let cia_c = this.initYiledLayer('cia_c'); //影像注记
      let img_c = this.initYiledLayer('img_c'); //影像地图

      this.layersInstance.cva_c = cva_c;
      this.layersInstance.vec_c = vec_c;

      this.layersInstance.cia_c = cia_c;
      this.layersInstance.img_c = img_c;

      /*初始化地图 */
      let map = new this.gisConstructor.Map({
        spatialReference: {
          wkid: 4326
        },
        basemap: {
          baseLayers: [this.layersInstance.vec_c, this.layersInstance.cva_c]
        },
        layers: [pointsFeatureLayer, linesFeatureLayer, ringsFeatureLayer]
      });
      this.map = map;
      let view = new this.gisConstructor.MapView({
        container: container,
        spatialReference: {
          wkid: 4326
        },
        map: map,
        scale: 7000000, // 限制比例尺
        center: [111.42610500035, 33.76651600041],
      });

      this.view = view;

      let applicationDiv = document.createElement('div');
      this.gisInstance.map = map;
      this.gisInstance.mapView = view;
      let full = new this.gisConstructor.ScaleBar({
        view: view,
        element: applicationDiv
      });

      view.popup.autoOpenEnabled = false;

      view.ui.add(full, 'bottom-right');

      view.on('click', function (event) {
        view.hitTest(event).then(function (response) {
          if (response.results.length) {
            const result = response.results[0];
            if (result && result.graphic) {
              const geometryType = result.graphic.geometry.type;
              const graphic = result.graphic;
              switch (geometryType) {
                case 'point':
                  graphic.symbol = symbols[0]
                  break;
                case 'polyline':
                  graphic.symbol = symbols[1]
                  break;
                case 'polygon':
                  graphic.symbol = symbols[2]
                  break;

                default:
                  break;
              }
              view.graphics.removeAll(); //清除上一次点击目标
              view.graphics.add(graphic); //添加新的点击目标
            }
          }
        })
      })
    },
    initYiledLayer(mapType) {
      let result = this.gisConstructor.WebTileLayer(
        'http://{subDomain}.tianditu.com/DataServer?T=' + mapType +
        '&X={col}&Y={row}&L={level}' +
        '&tk=55d6f64ddfde40d894b6a72a4d678f84', {
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          tileInfo: tileInfo,
          spatialReference: {
            wkid: 4326
          },
        }
      )
      this.layerID[mapType] = result.id;
      return result;
    },
    addFeature(geometry) {
      const attributes = {};
      attributes["population"] = 18;
      attributes["name"] = "DKK";
      attributes["address"] = "kfjs kke fggg";

      // Date.now() returns number of milliseconds elapsed
      // since 1 January 1970 00:00:00 UTC.
      // attributes["Report_Date"] = Date.now();

      const addFeature = new this.gisConstructor.Graphic({
        geometry: geometry,
        attributes: attributes
      });

      const deleteFeatures = [{
          objectId: 467
        },
        {
          objectId: 500
        }
      ];

      // or specify globalIds of features to be deleted
      // const deleteFeature = [
      //  { globalId: "18633204-1801-4d35-a73a-174563608ad9" }
      // ];

      const promise = featureLayer.applyEdits({
        addFeatures: [addFeature]
      });
    },
    showFeature(name) {
      const queryTask = new this.gisConstructor.queryTask({
        url: this.showServerUrl
      })
      const query = new this.gisConstructor.Query();
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = "name = " + name;
      queryTask.execute(query).then(res => {
        console.log(res);
      })
    },
    setBuffer() {
      const view = this.gisInstance.mapView;
      const viewGraphics = this.gisInstance.mapView.graphics;
      console.log(viewGraphics.items[0].geometry);
      const bufferGeometry = viewGraphics.items[0].geometry;
      const buffer=this.gisConstructor.geometryEngine.geodesicBuffer(bufferGeometry,150,"kilometers",false);  //输入的几何图形具有 WGS84 (wkid: 4326) 或 Web Mercator的空间引用
      // var buffer = this.gisConstructor.geometryEngine.buffer(geometry, 150, "kilometers", false); //使用投影坐标系统缓冲几何图形时（Web Mercator投影坐标系除外）。
      
      let bufferSymbol = null;
      const geometryType = bufferGeometry.type;
      switch (geometryType) {
        case 'point':
          bufferSymbol = symbols[0]
          break;
        case 'polyline':
          bufferSymbol = symbols[1]
          break;
        case 'polygon':
          bufferSymbol = symbols[2]
          break;

        default:
          break;
      }
      
      view.graphics.add((new this.gisConstructor.Graphic({
        geometry: buffer,
        symbol: bufferSymbol
      })));
    },
    clearBuffer() {
      const view = this.gisInstance.mapView;
      view.graphics.removeAll();
    }
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}
