<!--  -->
<template>
  <div class="show-map">
    <map-dialog :show.sync="showVal">
      <div id="mapView">
        <p>123</p>
      </div>
    </map-dialog>
  </div>
</template>

<script>
import MapDialog from "components/common/dialog/Dialog";
import {
  loadCss,
  loadModules,
  setDefaultOptions
  /*setDefalutOptions*/
} from "esri-loader";
import tileInfo from "../config/tileInfo";
import { gisModules, mapServerUrl } from "../config/config";
export default {
  name: "ShowMap",
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
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
      showVal: {
          get(){
              return this.show;
          },
          set() {
          }
      }
  },
  components: {
    MapDialog
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
        let name = this.gisModules[k].split("/").pop();
        this.gisConstructor[name] = args[k];
      }
      /*初始化各种图层*/
      let cva_c = this.initYiledLayer("cva_c"); //矢量注记
      let vec_c = this.initYiledLayer("vec_c"); //矢量底图

      let cia_c = this.initYiledLayer("cia_c"); //影像注记
      let img_c = this.initYiledLayer("img_c"); //影像地图

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
        container: "mapView",
        spatialReference: {
          wkid: 4326
        },
        map: map,
        scale: 7000000, // 限制比例尺
        center: [111.42610500035, 33.76651600041]
      });

      this.view = view;

      let applicationDiv = document.createElement("div");
      this.gisInstance.map = map;
      this.gisInstance.mapView = view;
      let full = new this.gisConstructor.ScaleBar({
        view: view,
        element: applicationDiv
      });

      view.popup.autoOpenEnabled = false;

      view.ui.add(full, "bottom-right");
    },
    initYiledLayer(mapType) {
      let result = this.gisConstructor.WebTileLayer(
        "http://{subDomain}.tianditu.com/DataServer?T=" +
          mapType +
          "&X={col}&Y={row}&L={level}" +
          "&tk=55d6f64ddfde40d894b6a72a4d678f84",
        {
          subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
          tileInfo: tileInfo,
          spatialReference: {
            wkid: 4326
          }
        }
      );
      this.layerID[mapType] = result.id;
      return result;
    },
  },
  destroyed() {
//   window.removeEventListener('resize', this.resizeWin) //销毁监听事件
    this.show = false;
}
};
</script>
<style lang='scss' scoped>
</style>