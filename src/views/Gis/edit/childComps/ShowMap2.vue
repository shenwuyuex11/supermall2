<template>
  <div>
    <el-button ref="dialog" type="primary" @click="onRegister">Register</el-button>
    <map-edit ref="map"></map-edit>
  </div>
</template>

<script>
import ConfirmMixin from "../config/confirm_mixin";
import Register from "./register";
import MapEdit from "components/common/gis/commonConfig/GIS";
import { showServerUrl } from "../config/config";
export default {
  mixins: [ConfirmMixin],
  methods: {
    onRegister() {
      console.log(this.$refs.map);
      this.showGeophic();
      this.confirmBox({
        title: "注册账户",
        customClass: "w600",
        showCancelButton: true,
        confirmButtonText: "注册",
        component: Register,
        componentName: "Register",
        confirmValidate: (action, cpt, done) => {
          if (action === "cancel") {
            cpt.clearValidate();
            return done();
          }
          cpt.validate(valid => {
            if (!valid) return;
            cpt.showGeophic();
            console.log("{userData}: ", { ...cpt.userData });
            cpt.clearValidate();
            done();
          });
          cpt.showGeophic();
        }
      }).catch(() => {});
    },
    getGeo(name) {
      const query = new this.$refs.map.gisConstructor.Query();
      const queryTask = new this.$refs.map.gisConstructor.QueryTask({
        url: this.showServerUrl
      });
      const showDialog = this.$refs.dialog.map;
      console.log(showDialog);
      query.where = "name = 'fff'";
      // query.outSpatialReference = {
      //   wkid: 102100
      // };
      query.returnGeometry = true;
      query.outFields = ["*"];
      queryTask.execute(query).then(function(results) {
        // Results.graphics contains the graphics returned from query
        console.log(results.features[0].geometry);
        // Create a symbol for drawing the point
        const markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [226, 119, 40],
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
        };

        // Create a graphic and add the geometry and symbol to it
        const pointGraphic = new Graphic({
          geometry: results.features[0].geometry,
          symbol: markerSymbol
        });

        this.$refs.dialog.showGeophic(pointGraphic);
      });
    }
  },
  components: {
    MapEdit
  }
};
</script>
<style>
.el-message-box.w600 {
  width: 600px;
}
</style>
