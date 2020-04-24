<template>
  <div id="mapView">
    <div class="register-form">
      <el-form ref="fm" :model="userData" label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userData.userName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userData.password" />
        </el-form-item>
        <el-form-item label="重新密码" prop="repassword">
          <el-input v-model="userData.repassword" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  loadCss,
  loadModules,
  setDefaultOptions
  /*setDefalutOptions*/
} from "esri-loader";
import tileInfo from "../config/tileInfo";
import { gisModules, mapServerUrl, showServerUrl } from "../config/config";

// 导入vuex封装的内容
import { mapGetters } from "vuex";

export default {
  name: "Register",
  data() {
    return {
      userData: {
        userName: "",
        password: "",
        repassword: ""
      },
      rules: {
        userName: { required: true, message: "请输入用户名", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" },
        repassword: {
          validator: (rule, value, callback) => {
            if (value !== this.userData.password) {
              return callback(new Error("两次输入密码不一致"));
            }
            callback();
          },
          trigger: "blur"
        }
      },
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
  methods: {
    validate(cb) {
      this.showGeophic();
      return this.$refs.fm.validate(cb);
    },
    clearValidate() {
      this.$refs.fm.resetFields();
      this.$refs.fm.clearValidate();
    },
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
        center: [118.9, 38.4]
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

      //queryTask查询

      const query = new this.gisConstructor.Query();
      const queryTask = new this.gisConstructor.QueryTask({
        url: this.showServerUrl
      });
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

        console.log('123')

        // Create a graphic and add the geometry and symbol to it
        const pointGraphic = new this.gisConstructor.Graphic({
          geometry: results.features[0].geometry,
          symbol: markerSymbol
        });
        this.view.graphics.add(pointGraphic);
      });
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
    showGraphic() {
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
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters(["findTask2"]),
    ditInfos() {
      return this.findTask2;
    }
  }
};
</script>