<!--  -->
<template>
  <div class="wrapper">
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
import Vue from "vue";

import esriLoader from "esri-loader";

export default {
  name: "Test2",
  data() {
    return {};
  },
  mounted() {
    const options = { url: "https://js.arcgis.com/3.27/" };
    esriLoader.loadModules(["esri/map"], options).then(([Map]) => {
      let map = new Map(this.$refs.map, {
        backgroundColor: "#eee",
        basemap: "streets",
        logo: false,
        slider: false,
        zoom: 7,
        minZoom: 7
      });
      Vue.prototype.$map = map;
    });
  }
};
</script>
<style scoped>
@import url("https://js.arcgis.com/3.27/esri/css/esri.css");
body {
  margin: 0;
}
.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>