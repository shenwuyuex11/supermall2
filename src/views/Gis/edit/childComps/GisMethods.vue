<!--  -->
<template>
  <div class="gis-methods"></div>
</template>

<script>
import {
  loadCss,
  loadModules,
  setDefaultOptions
  /*setDefalutOptions*/
} from "esri-loader";

import { gisModules } from "../config/config";
export default {
  name: "GisMehtods",
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
      /*处理构造函数，绑定到gisConstructor,方便组件内其他函数调用gis api 的模块*/
      for (let k in args) {
        let name = this.gisModules[k].split("/").pop();
        this.gisConstructor[name] = args[k];
      }
    },
    ttt() {
        console.log(11111);
    }
  }
};
</script>
<style scoped>
</style>