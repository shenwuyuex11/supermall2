<!--  -->
<template>
  <div id="viewDiv"></div>
</template>

<script>
import { loadModules } from "esri-loader"; //导入esri依赖

//导入内部配置
import {
  fieldConfig,
  fieldConfigLine,
  defaultFeatureLayer,
  lineFeatureLayer,
  extent
} from "./config";

export default {
  name: "Query",
  data() {
    return {
      map: null,
      mapView: null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/views/2d/draw/Draw",
        "esri/Graphic",
        "esri/geometry/Polygon",
        "esri/tasks/IdentifyTask",
        "esri/tasks/support/IdentifyParameters",
        "esri/layers/TileLayer",
        "esri/symbols/SimpleFillSymbol",
        "esri/layers/MapImageLayer"
      ]).then(
        ([
          Map,
          MapView,
          FeatureLayer,
          Draw,
          Graphic,
          Polygon,
          IdentifyTask,
          IdentifyParameters,
          TileLayer,
          SimpleFillSymbol,
          MapImageLayer
        ]) => {
          let featureLayer,
            featureLayer2,
            rectangel,
            BOUALayers,
            identifyTask,
            params;
          // URL to the map service where the identify will be performed
          var soilURL =
            "http://localhost:6080/arcgis/rest/services/Edit/editPolygon/MapServer";

          // Add the map service as a TileLayer for fast rendering
          // Tile layers are composed of non-interactive images. For that reason we'll
          // use IdentifyTask to query the service to add interactivity to the app
          //   var parcelsLayer = new MapImageLayer({
          //     url:
          //       "http://localhost:6080/arcgis/rest/services/Edit/editPolygon/MapServer"
          //   });
          const parcelsLayer = new FeatureLayer({
            url:
              "http://localhost:6080/arcgis/rest/services/Edit/editPolygon/FeatureServer",
            outFields: ["*"],
            id: "incidentsLayer"
          });

          BOUALayers = [featureLayer, featureLayer2];
          const map = new Map({
            basemap: "osm" //实例化地图
          });
          map.add(parcelsLayer);
          this.map = map;

          //  center: [123.5, 41.8],
          const view = new MapView({
            container: "viewDiv",
            map: this.map,
            zoom: 11,
            center: [115.5, 30.8],
            extent: extent
          });
          this.mapView = view;

          view.when(function() {
            // executeIdentifyTask() is called each time the view is clicked
            view.on("click", executeIdentifyTask);

            // Create identify task for the specified map service
            identifyTask = new IdentifyTask(soilURL);

            // Set the parameters for the Identify
            params = new IdentifyParameters();
            params.tolerance = 3;
            params.layerIds = [0, 1, 2];
            params.layerOption = "top";
            params.width = view.width;
            params.height = view.height;

            // Executes each time the view is clicked
            function executeIdentifyTask(event) {
              // Set the geometry to the location of the view click
              params.geometry = event.mapPoint;
              params.mapExtent = view.extent;
              document.getElementById("viewDiv").style.cursor = "wait";

              // This function returns a promise that resolves to an array of features
              // A custom popupTemplate is set for each feature based on the layer it
              // originates from
              identifyTask.execute(params).then(showQueryResult);
              // Send the array of features to showPopup()

              // Shows the results of the Identify in a popup once the promise is resolved
              function showPopup(response) {
                if (response.length > 0) {
                  view.popup.open({
                    features: response,
                    location: event.mapPoint
                  });
                }
                document.getElementById("viewDiv").style.cursor = "auto";
              }
            }

            //空间查询展示
            function showQueryResult(response) {
              view.graphics.removeAll();
              console.log(response.results);

              //创建面符号
              //   let fill = simpleSymbolConstructor("fill");

              if (response.results.length > 0) {
                let graphics = [];
                for (let i = 0; i < response.results.length; i++) {
                  let result = response.results[i];
                  //获得图形graphic
                  let graphic = new Graphic({
                    geometry: result.feature.geometry,
                    sysbol: { type: "simple-fill" }
                  });
                  //设置图形的符号
                  //   graphic.symbol = fill;
                  // let namevalue = graphic.attributes.NAME;
                  // console.log(namevalue);

                  graphics.push(graphic);
                  // newgLayer.add(graphic)
                }

                view.graphics.addMany(graphics);
              }
            }
          });
        }
      );
    }
  }
};
</script>
<style scoped>
/* @import url("https://js.arcgis.com/4.14/esri/css/main.css"); */
html,
body,
#viewDiv {
  padding: 0;
  margin: 0;
  height: 90vh;
  width: 100vw;
}
.esri-popup .esri-popup-header .esri-title {
  font-size: 18px;
  font-weight: bolder;
}

.esri-popup .esri-popup-body .esri-popup-content {
  font-size: 14px;
}
</style>