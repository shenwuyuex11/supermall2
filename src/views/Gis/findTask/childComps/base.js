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

      view.ui.add(full, 'bottom-right');
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
    findTask() {
    },
    // Executes on each button click
    doFind() {
      // Set parameters to only query the Counties layer by name
      // 可以根据需求决定是否返回几何信息    returnGeometry: true
      const params = new this.gisConstructor.FindParameters({
        layerIds: [0],
        returnGeometry: true,
        searchFields: ["ADDRESS"]
      });
      params.searchText = document.getElementById("inputTxt").value;
      // Create a FindTask pointing to a map service
      const find = new this.gisConstructor.FindTask({
        url: mapServerUrl
      });

      find
        .execute(params)
        .then(this.showResults)
        .catch(rejectedPromise => {
          console.log(rejectedPromise);
        });
    },
    // ...mapActions(['addFindResults']), //调用vuex里action中的方法来管理findtask获取的目标数据。
    // Executes when the promise from find.execute() resolves
    showResults(response) {
      let results = response.results;

      this.findResults = []; //清空数组，以便每次查找时重新渲染table，如果不清空会重复添加。
      for (let i = 0; i < results.length; i++) {
        // console.log(results[i].feature.geometry);
        const findInfo = {};
        let geo = results[i].feature.geometry;
        // findInfo.geometry = results[i].feature.geometry.rings;
        findInfo.name = results[i].feature.attributes.name;
        findInfo.address = results[i].feature.attributes.address;
        findInfo.population = results[i].feature.attributes.polulation;

        this.findResultsGeo.push(geo);
        this.findResults.push(findInfo);
        // console.log(results[i].feature.geometry);

        // this.addFindResults(findInfo) // 仓库管理findtask获取的数据，因为一个列表不太需要封装成子组件，所以暂时先不放在store里,暂时存在data里
      }
      return results;
    },
    gotoGraphic(index) {
      let view = this.view;
      let center,polygon 

      view.popup.autoOpenEnabled = false;

      view.on("click", function (evt) {
        if (center == null) {
          return;
        }

        view.hitTest(evt).then(function (response) {
          const result = response.results[0];
          let centerP = polygon.centroid;
          console.log(centerP)
          if (result && result.graphic.geometry != null) {
            view.popup.open({
              // Set the popup's title to the coordinates of the location
              title: "位置: [" + centerP.x + ", " + centerP.y + "]",
              // location: evt.mapPoint // Set the location of the popup to the clicked location
              location: evt.mapPoint
            });
          }
        });
      })
      polygon = new this.gisConstructor.Polygon({
        hasZ: true,
        hasM: true,
        rings: this.findResultsGeo[index].rings,
        spatialReference: {
          wkid: 4326
        }
      });

      center = polygon.centroid

      let pt = new this.gisConstructor.Point({
        latitude: center.y,
        longitude: center.x
      });
      const opts = {
        duration: 1000
      };
      this.gisInstance.mapView
        .goTo({
            target: pt,
            zoom: 7
          },
          opts
        ).then(
          res => {
            console.log("定位成功");
            // Create a symbol for drawing the point
            let sym = {
              type: "simple-fill", // autocasts as new SimpleFillSymbol()
              color: "red",
              outline: { // autocasts as new SimpleLineSymbol()
                color: [128, 128, 128, 0.5],
                width: "0.5px"
              }
            };

            let currentGraphic = new this.gisConstructor.Graphic({
              geometry: this.findResultsGeo[index],
              symbol: sym
            });

            let tempLayer = new this.gisConstructor.GraphicsLayer();
            // this.gisInstance.map.layers.remove(tempLayer);
            this.gisInstance.map.layers.removeAll();

            tempLayer.graphics.add(currentGraphic);
            this.gisInstance.map.add(tempLayer);
            return tempLayer;
          }
        )
    }

  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}
