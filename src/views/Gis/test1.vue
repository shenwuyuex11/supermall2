<!--  -->
<template>
  <div>
    <div id="viewDiv">
      <div class="control">
        <button @click="addClick">添加</button>
        <button @click="viewClick">223</button>
      </div>
    </div>
    <div id="basemapGalleryDiv"></div>
    <div id="infoDiv">
      <button>123</button>
    </div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";

import Test2 from "./test2";

const _self = this; //定义一个_self防止后续操作中this丢失

export default {
  name: "Test1",
  data() {
    return {
      map: null,
      view: null,
      scaleBar: null,
      geometry: {},
      mapAPI: {},
      gra: {},
      gisModules: [
        "esri/map",
        "esri/dijit/OverviewMap",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/layers/GraphicsLayer",
        "esri/tasks/GeometryService",
        "esri/dijit/Scalebar",
        "esri/toolbars/draw",
        "esri/toolbars/edit",
        "esri/geometry/Extent",
        "esri/geometry/Geometry",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/symbols/PictureFillSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/jsonUtils",
        "esri/SpatialReference",
        "esri/graphic",
        "esri/Color",
        "esri/symbols/TextSymbol",
        "esri/dijit/InfoWindow",
        "esri/tasks/ProjectParameters",
        "esri/tasks/query"
      ],
      lineLayer: null,
      ifeatureLayer: {}
    };
  },
  components: {
    Test2
  },
  mounted() {
    this.createMap();
  },
  methods: {
    createMap() {
      loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/ScaleBar",
        "esri/widgets/Sketch",
        "esri/widgets/ScaleRangeSlider",
        "esri/widgets/Zoom",
        "esri/layers/GraphicsLayer",
        "esri/widgets/BasemapToggle",
        "esri/widgets/Search",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/geometry/Polyline"
      ])
        .then(
          ([
            Map,
            MapView,
            ScaleBar,
            Sketch,
            ScaleRangeSlider,
            Zoom,
            GraphicsLayer,
            BasemapToggle,
            Search,
            FeatureLayer,
            Graphic,
            Polyline
          ]) => {
            this.gra = Graphic;
            this.ifeatureLayer = FeatureLayer;
            const tempGraphicsLayer = new GraphicsLayer();
            this.map = new Map({
              basemap: "streets", //实例化地图
              layers: [tempGraphicsLayer]
            });

            // Typical usage "http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/MonterreyBayCanyon_WFL/FeatureServer/2"
            const lineLayer = new FeatureLayer({
              // URL to the service
              url:
                "http://localhost:6080/arcgis/rest/services/Edit/editLine2/FeatureServer/0"
            });
            this.map.add(lineLayer);
            this.lineLayer = lineLayer;

            // this.map.add(tempGraphicsLayer, 1);

            const view = new MapView({
              container: "viewDiv",
              map: this.map,
              zoom: 11,
              center: [104.072044, 30.663776]
            });
            this.view = view;

            this.scaleBar = new ScaleBar({
              view: view,
              // unit: "dual",
              unit: "metric",
              container: basemapGalleryDiv
            });

            this.view.ui.add(this.scaleBar, {
              position: "bottom-left"
            });

            const zoom = new Zoom({
              view: view
            });

            const sketch = new Sketch({
              layer: tempGraphicsLayer,
              view: view,
              // graphic will be selected as soon as it is created
              creationMode: "update"
            });

            view.ui.add(sketch, "top-right");

            const searchWidget = new Search({
              view: view
            });

            // view.ui.add([searchWidget, "infoDiv"], "bottom-left");
            view.ui.add(["infoDiv"], "bottom-left");

            // view.on("mouse-wheel", function(evt) {
            //   view.hitTest(evt).then(function(response) {
            //     let results = response.results;
            //     console.log(123);
            //   });
            // });
            // this.view.on("double-click", function(evt) {
            //   console.log(tempGraphicsLayer);
            // });
            this.view.on("click", function(evt) {
              // console.log(view.focused);
            });
            this.view.on("blur", function(evt) {
              // console.log("bulr");
            });
            this.view.on("drag", function(evt) {
              // Print out the current state of the
              // drag event.
              // console.log("drag state", evt.action);
            });
            this.view.on("hold", function(event) {
              // The event object contains the mapPoint and the screen coordinates of the location
              // that was clicked.
              console.log("hold at screen point", event.x, event.y);
              console.log("hold at map point", event.mapPoint);
            });
            // this.view.focus(
            //   console.log('123')
            // )

            const toggle = new BasemapToggle({
              view: view,
              nextBasemap: "hybrid"
            });

            view.ui.add(toggle, "top-right");

            // view.ui.add([compass, toggle], "top-leading");

            view.on("double-click", function(evt) {
              view.hitTest(evt).then(function(response) {
                const drawGeo = tempGraphicsLayer.graphics.items[0].geometry;
                const attributes = {};
                attributes["Description"] = "This is the description";
                attributes["Address"] = "380 New York St";
                const addFeature = new Graphic({
                  geometry: drawGeo,
                  attributes: attributes
                });
                console.log(addFeature);

                lineLayer
                  .applyEdits({
                    addFeatures: [addFeature]
                  })
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              });
            });

            view.when(function(evt) {
              // view.on("double-click", function(evt) {
              //   view.hitTest(evt).then(function(response) {
              //     const drawGeo = tempGraphicsLayer.graphics.items[0].geometry;
              //     const attributes = {};
              //     attributes["Description"] = "This is the description";
              //     attributes["Address"] = "380 New York St";
              //     const addFeature = new Graphic({
              //       geometry: drawGeo,
              //       attributes: attributes
              //     });
              //     console.log(addFeature);
              //     lineLayer.applyEdits({
              //       addFeatures: [addFeature]
              //     }).then(res => {
              //       console.log(res)
              //     }).catch(err => {
              //       console.log(err)
              //     });
              //   });
              // });
              // setUpClickHandler();
              // function setUpClickHandler() {
              //   view.on("mouse-wheel", function(evt) {
              //     view.hitTest(evt).then(function(response) {
              //       let results = response.results;
              //       console.log(view.scale);
              //     });
              //   });
              // }
            });
          }
        )
        .catch(err => {
          _self.$message("地图创建失败" + err);
        });
    },
    addClick() {
      const polyline = {
        type: "polyline", // autocasts as new Polyline()
        paths: [
          [-111.3, 52.68],
          [-98, 49.5],
          [-93.94, 29.89]
        ]
      };
      const polylineSymbol = {
        type: "simple-line", // autocasts as SimpleLineSymbol()
        color: [226, 119, 40],
        width: 4
      };

      const polylineAtt = {
        Name: "Keystone Pipeline",
        Owner: "TransCanada"
      };

      const gra = this.gra;
      const polylineGraphic = new gra({
        geometry: polyline,
        symbol: polylineSymbol,
        attributes: polylineAtt
      });

      const attributes = {};
      attributes["Description"] = "This is the description";
      attributes["Address"] = "380 New York St";

      // Date.now() returns number of milliseconds elapsed
      // since 1 January 1970 00:00:00 UTC.
      // attributes["Report_Date"] = Date.now();

      const addFeature = new gra({
        geometry: polylineGraphic.geometry,
        attributes: attributes
      });

      this.lineLayer.applyEdits({
        addFeatures: [addFeature]
      });

      // console.log(polylineGraphic.geometry.spatialReference.wkid);
      // console.log(polylineGraphic.geometry);
      console.log(polylineGraphic.geometry);
    },
    viewClick() {
      // console.log(this.view.focused)
      const args = 28;
      const tt = "esri/map";
      const names = tt
        .replace(/-/g, "")
        .split("/")
        .pop();
      let strArys = names.split("");
      const ss = strArys[0].toUpperCase();
      strArys.join("");
      for (let k in args) {
        let name = this.gisModules[k]
          .replace(/-/g, "")
          .split("/")
          .pop();
        let strAry = name.split("");
        if (strAry.length > 0) {
          strAry[0] = strAry[0].toUpperCase();
        }
        this.mapAPI[strAry.join("")] = args[k];
      }
      console.log(strArys.join(""));
    },
    test2() {
      view.on("zoom", function(event) {
        console.log(view.scale);
        this.currentScale = view.scale;
      });
    },
    myClickHandler(event) {
      alert(
        "User clicked at " +
          event.screenPoint.x +
          ", " +
          event.screenPoint.y +
          " on the screen. The map coordinate at this point is " +
          event.mapPoint.x +
          ", " +
          event.mapPoint.y
      );
    }
  }
};
</script>
<style scoped>
/* 引入esri官方CSS */
/* @import "https://js.arcgis.com/4.14/esri/themes/dark/main.css"; */
/* @import "https://js.arcgis.com/4.14/esri/themes/light/main.css"; */

body {
  margin: 0; /**主要是去除谷歌浏览器默认的8像素的外边距 */
}
#viewDiv {
  height: 90vh;
  width: 100vw;
}
/* .esri-scale-bar__bar-container {
    background-color: red;
}
.esri-scale-bar__bar-container--line {
    display: none;
} */
.test {
  background-color: red;
}
.input {
  position: relative;
  margin-bottom: 100px;
  padding-bottom: 100px;
  z-index: 999;
}
.control {
  width: 100px;
  background-color: #fcf;
}
#infoDiv {
  width: 10px;
}
</style>