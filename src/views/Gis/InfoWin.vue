<!--  -->
<template>
  <div id="viewDiv"></div>
</template>

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
        "esri/layers/FeatureLayer"
      ]).then(([Map, MapView, GraphicsLayer, FeatureLayer]) => {
        this.map = new Map({
          basemap: "streets" //实例化地图
        });

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

        //乡镇级属性模版
        var popupTemplate = {
          title: "乡镇数据",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "Description",
                  label: "描述",
                  format: {
                    places: 0,
                    digitSeparator: true
                  }
                },
                {
                  fieldName: "Address",
                  label: "地址",
                  format: {
                    places: 0,
                    digitSeparator: true
                  }
                }
              ]
            }
          ]
        };

        var lineInfo = new FeatureLayer({
          url:
            "http://localhost:6080/arcgis/rest/services/Edit/editLine2/FeatureServer/0",
          outFields: ["*"],
          popupTemplate: popupTemplate
        });
        this.map.add(lineInfo);

        view.on("click", function (evt) {
            view.hitTest(evt).then(function (response) {
                var result = response.results[0];
                if (result && result.graphic) {
                    console.log(result);
                    var graphic = result.graphic;
                    //自定义高亮
                    //这里的几何图形是面状，配置graphic的symbol为fillSymbol
                    graphic.symbol = {
                        type: "simple-line",
                        color: [226, 119, 40],
                        width: 4
                    };
                    view.graphics.removeAll();//清除上一次点击目标
                    view.graphics.add(graphic);//添加新的点击目标
                }
            })
        });
      });
    }
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