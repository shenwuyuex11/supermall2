import {
  loadCss,
  loadModules,
  setDefaultOptions,
  /*setDefalutOptions*/
} from 'esri-loader';
//vuex
import {
  mapActions
} from 'vuex';
import tileInfo from './tileInfo';
import {
  gisModules,
  mapServerUrl
} from './config'
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
      findResultsGeo: []
    }
  },
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
      let container = this.$refs.map;

      /*处理构造函数，绑定到gisConstructor,方便组件内其他函数调用gis api 的模块*/
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop();
        this.gisConstructor[name] = args[k];
      }
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
        }
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

      view.on("click", function (evt) {
        let x = document.getElementById('pointx').value;
        let y = document.getElementById('pointy').value;
        if (x == null || y == null) {
          return;
        }
        view.hitTest(evt).then(function (response) {
          const result = response.results[0];

          if (result && result.graphic.geometry != null) {
            view.popup.open({
              // Set the popup's title to the coordinates of the location
              title: "位置: [" + y + ", " + x + "]",
              // location: evt.mapPoint // Set the location of the popup to the clicked location
              // location: pt
              location: evt.mapPoint
            });
          }
        });
      });
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
    // 定位方法
    gotoClick() {
      let tempLayer;
      let x = document.getElementById('pointx').value;
      let y = document.getElementById('pointy').value;

      let view = this.view;
      let Point = this.gisConstructor.Point;
      let Graphic = this.gisConstructor.Graphic;
      let GraphicsLayer = this.gisConstructor.GraphicsLayer;
      let map = this.gisInstance.map;

      view.when(function () {
        console.log("开始定位");
        let pt = new Point({
          latitude: x,
          longitude: y
        });
        const opts = {
          duration: 3000
        };
        view
          .goTo({
              target: pt,
              zoom: 7
            },
            opts
          )
          .then(res => {
            console.log("定位成功");
            // Create a symbol for drawing the point
            let markerSymbol = {
              type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
              color: [226, 119, 40]
            };

            // Create a graphic and add the geometry and symbol to it
            let pointGraphic = new Graphic({
              geometry: pt,
              symbol: markerSymbol
            });

            tempLayer = new GraphicsLayer();
            map.layers.removeAll();

            tempLayer.graphics.add(pointGraphic);
            map.add(tempLayer);
            return tempLayer;

            // view.graphics.removeAll(); //清除上一次点击目标
            // view.graphics.add(pointGraphic); //添加新的点击目标
            // return pointGraphic;
          })
          .catch(err => {
            console.log("定位失败");
          });
        // let goClick = (document.getElementById(
        //   "gotoBtn"
        // ).onclick = function () {
        //   console.log("开始定位");
        //   let pt = new Point({
        //     latitude: x,
        //     longitude: y
        //   });
        //   const opts = {
        //     duration: 1000
        //   };
        //   view
        //     .goTo({
        //         target: pt,
        //         zoom: 12
        //       },
        //       opts
        //     )
        //     .then(res => {
        //       console.log("定位成功");
        //       // Create a symbol for drawing the point
        //       let markerSymbol = {
        //         type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        //         color: [226, 119, 40]
        //       };

        //       // Create a graphic and add the geometry and symbol to it
        //       let pointGraphic = new Graphic({
        //         geometry: pt,
        //         symbol: markerSymbol
        //       });

        //       tempLayer = new GraphicsLayer();
        //       map.layers.remove(tempLayer);

        //       tempLayer.graphics.add(pointGraphic);
        //       map.add(tempLayer);
        //       return tempLayer;

        //       // view.graphics.removeAll(); //清除上一次点击目标
        //       // view.graphics.add(pointGraphic); //添加新的点击目标
        //       // return pointGraphic;
        //     })
        //     .catch(err => {
        //       console.log("定位失败");
        //     });
        // });
      });
    }
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}
