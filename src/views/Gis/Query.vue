<!--  -->
<template>
  <div id="viewDiv">
    <!--画矩形-->
    <div id="rectangle-button" class="esri-widget esri-widget-button esri-interactive" title="框选">
      <span class="esri-icon-checkbox-unchecked"></span>
    </div>
  </div>
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
        "esri/layers/MapImageLayer",
        "esri/tasks/support/Query",
        "esri/tasks/QueryTask"
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
          MapImageLayer,
          Query,
          QueryTask
        ]) => {
          let featureLayer, featureLayer2, rectangel, parcelsLayer;
          featureLayer = new FeatureLayer({
            url: defaultFeatureLayer,
            outFields: ["*"],
            popupEnabled: false,
            id: "incidentsLayer"
          });

          featureLayer2 = new FeatureLayer({
            url:
              "http://localhost:6080/arcgis/rest/services/Edit/editPoint/MapServer/0",
            outFields: ["*"]
          });

          // Add the map service as a TileLayer for fast rendering
          // Tile layers are composed of non-interactive images. For that reason we'll
          // use IdentifyTask to query the service to add interactivity to the app
          parcelsLayer = new MapImageLayer({
            url:
              "http://localhost:6080/arcgis/rest/services/Edit/editPolygon/MapServer"
          });
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

          view.when(function(evt) {
            let draw = new Draw({
              view: view
            });

            let identifyQuery = document.getElementById("rectangle-button");

            identifyQuery.onclick = function() {
              enableCreateRectangle(draw, view);
            };
          });
          function enableCreateRectangle(draw, view) {
            let action = draw.create("rectangle", {
              mode: "click"
            });

            view.focus();

            // 顶点添加事件
            action.on("vertex-add", createRectangle);
            //顶点移除
            action.on("vertex-remove", createRectangle);
            //鼠标移动
            action.on("cursor-update", createRectangle);
            //绘制完成
            action.on("draw-complete", createRectangle);
          }

          function createRectangle(event) {
            //获取所有顶点
            let vertices = event.vertices;

            //两点画矩形
            if (vertices.length < 2) {
              return;
            }
            let rings = [
              vertices[0],
              [vertices[0][0], vertices[1][1]],
              vertices[1],
              [vertices[1][0], vertices[0][1]]
            ];
            //清除之前绘制
            view.graphics.removeAll();

            // 生成绘制的图形
            let graphic = new Graphic({
              geometry: new Polygon({
                hasZ: false,
                hasM: false,
                rings: [rings],
                spatialReference: view.spatialReference
              }),
              symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: [51, 51, 204, 0.9],
                style: "solid",
                outline: {
                  // autocasts as new SimpleLineSymbol()
                  color: "white",
                  width: 1
                }
              }
            });
            // 将绘制的图形添加到view
            view.graphics.add(graphic);

            if (event.type === "draw-complete") {
              SpatialQuery(
                "http://localhost:6080/arcgis/rest/services/Edit/editPolygon/FeatureServer/0",
                graphic.geometry,
                "intersects"
              );
            }
          }

          //空间查询(identify)
          function identifyTask(geometry) {
            //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
            let identifyTask = new IdentifyTask(parcelsLayer.url);
            //定义空间查询参数对象
            let params = new IdentifyParameters();
            //容差
            params.tolerance = 5;
            //是否返回几何信息
            params.returnGeometry = true;
            //空间查询的图层
            params.layerIds = [0];
            //空间查询的条件
            // params.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            params.layerOption = "all";
            // params.width = view.width;
            // params.height = view.height;
            params.width = parcelsLayer.fullExtent.width;
            params.height = parcelsLayer.fullExtent.height;
            // console.log(params.width);
            // console.log(params.height);
            //空间查询的几何对象
            params.geometry = geometry;
            params.mapExtent = view.fullExtent; //map.extent;
            //执行空间查询
            identifyTask.execute(params).then(showQueryResult);
          }

          function SpatialQuery(layerUrl, queryGeom, spatialRelationship) {
            let queryTask = new QueryTask({
              url: layerUrl
            });

            let query = new Query();
            query.geometry = queryGeom;
            query.spatialRelationship = spatialRelationship; //default "intersects"
            query.outFields = ["*"];
            // query.where = "NAME = 'ya'";
            query.outSpatialReference = { wkid: 102100 };
            query.returnGeometry = true;

            queryTask.execute(query).then(function(response) {
              // console.log(response.features);
              showQueryResult(response);
            });
          }

          //空间查询展示
          function showQueryResult(response) {
            view.graphics.removeAll();
            console.log(response);

            //创建面符号
            // let fill = simpleSymbolConstructor("fill");

            // let symbol = {
            //   type: "simple-line", // autocasts as new SimpleLineSymbol()
            //   color: "lightblue",
            //   width: "2px",
            //   style: "short-dot"
            // };

            if (response.features.length > 0) {
              let graphics = [];
              for (let i = 0; i < response.features.length; i++) {
                let result = response.features[i];
                //获得图形graphic
                const graphic = new Graphic({
                  geometry: result.geometry,
                  symbol: { type: "simple-fill" }
                });
                // let graphic = result.feature;
                //设置图形的符号
                // graphic.symbol = symbol;
                // let namevalue = graphic.attributes.NAME;
                // console.log(namevalue);

                graphics.push(graphic);
                // newgLayer.add(graphic)
              }

              view.graphics.addMany(graphics);
            }
          }
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
</style>