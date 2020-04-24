<!--  -->
<template>
  <div id="viewDiv">
    <div>
      <button id="gotoBtn" @click="gotoClick">定位</button>
      <input id="pointx" type="text">
      <input id="pointy" type="text">
    </div>
  </div>
</template>
<script src="./config/base.js"></script>
<script>
import { loadModules } from "esri-loader"; //导入esri依赖
export default {
  name: "InfoWin",
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
        "esri/layers/GraphicsLayer",
        "esri/layers/FeatureLayer",
        "esri/geometry/Point",
        "esri/symbols/MarkerSymbol",
        "esri/Graphic",
        "esri/tasks/Locator"
      ]).then(
        ([
          Map,
          MapView,
          GraphicsLayer,
          FeatureLayer,
          Point,
          MarkerSymbol,
          Graphic,
          Locator
        ]) => {
          let markerSymbol, tempLayer, pt;

          // Set up a locator task using the world geocoding service
          // Set up a locator task using the world geocoding service
          // let locatorTask = new Locator({
          //   url:
          //     "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
          // });
          const map = new Map({
            basemap: "streets-navigation-vector" //实例化地图
          });
          this.map = map;

          //   // Create a symbol for drawing the point
          //   markerSymbol = {
          //     type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          //     color: [226, 119, 40]
          //   };
          //   const pt2 = new Point({
          //     latitude: 28,
          //     longitude: 116
          //   });

          //   // Create a graphic and add the geometry and symbol to it
          //   var pointGraphic = new Graphic({
          //     geometry: pt2,
          //     symbol: markerSymbol
          //   });

          //   tempLayer = new GraphicsLayer();
          //   tempLayer.graphics.add(pointGraphic);
          //   map.add(tempLayer);

          const view = new MapView({
            container: "viewDiv",
            map: this.map,
            zoom: 7,
            center: [115.072044, 28.663776],

            extent: {
              xmin: 111.27418783887504,
              ymin: 27.65361115167269,
              xmax: 119.18589568326072,
              ymax: 30.663629324047992,
              spatialReference: 4326
            }
          });
          this.mapView = view;

          view.popup.autoOpenEnabled = false;

          view.on("click", function(evt) {
            if (!pt) {
              return;
            }
            view.hitTest(evt).then(function(response) {
              const result = response.results[0];
              console.log(map)

              if (result && result.graphic.geometry != null) {
                view.popup.open({
                  // Set the popup's title to the coordinates of the location
                  title: "位置: [" + pt.longitude + ", " + pt.latitude + "]",
                  // location: evt.mapPoint // Set the location of the popup to the clicked location
                  // location: pt
                  location: evt.mapPoint
                });
              }
            });
          });

          // view.on("click", function(event) {
          //   if (!pt) {
          //     return;
          //   }
          //   // Get the coordinates of the click on the view
          //   // var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
          //   // var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
          //   var lat = pt.latitude;
          //   var lon = pt.longitude;

          //   view.popup.open({
          //     // Set the popup's title to the coordinates of the location
          //     title: "Reverse geocode: [" + lon + ", " + lat + "]",
          //     location: event.mapPoint // Set the location of the popup to the clicked location
          //   });

          //   var params = {
          //     location: event.mapPoint
          //   };

          //   // Display the popup
          //   // Execute a reverse geocode using the clicked location
          //   locatorTask
          //     .locationToAddress(params)
          //     .then(function(response) {
          //       // If an address is successfully found, show it in the popup's content
          //       view.popup.content = response.address;
          //     })
          //     .catch(function(error) {
          //       // If the promise fails and no result is found, show a generic message
          //       view.popup.content = "No address was found for this location";
          //     });
          // });

          view.when(function() {
            let goClick = (document.getElementById(
              "gotoBtn"
            ).onclick = function() {
              let x = document.getElementById('pointx').value;
              let y = document.getElementById('pointy').value;
              console.log("开始定位");
              pt = new Point({
                latitude: y,
                longitude: x
              });
              const opts = {
                duration: 1000
              };
              view
                .goTo(
                  {
                    target: pt,
                    zoom: 12
                  },
                  opts
                )
                .then(res => {
                  console.log("定位成功");
                  // Create a symbol for drawing the point
                  markerSymbol = {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    color: [226, 119, 40]
                  };

                  // Create a graphic and add the geometry and symbol to it
                  var pointGraphic = new Graphic({
                    geometry: pt,
                    symbol: markerSymbol
                  });

                  map.layers.remove(tempLayer);
                  tempLayer = new GraphicsLayer();
                  tempLayer.graphics.add(pointGraphic);
                  map.add(tempLayer);
                  return tempLayer;

                  // view.graphics.removeAll(); //清除上一次点击目标
                  // view.graphics.add(pointGraphic); //添加新的点击目标
                  // return pointGraphic;
                })
                .then(res => {
                  //   console.log(res);
                })
                .catch(err => {
                  console.log("定位失败");
                });
            });
          });
        }
      );
    },
    gotoClick() {}
  }
};
</script>
<style scoped>
body {
  margin: 0; /**主要是去除谷歌浏览器默认的8像素的外边距 */
}
#viewDiv {
  height: 90vh;
  width: 100vw;
}
</style>