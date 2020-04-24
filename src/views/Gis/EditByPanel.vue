<!--  -->
<template>
  <div class="edit-by-panel">
    <div id="editArea" class="editArea-container" style="background-color: rgba(4,95,189,0.2)">
      <div id="addFeatureDiv">
        <h3 class="list-heading">空间属性编辑</h3>
        <ul style="font-size: 13px; padding-left: 1.5em;">
          <!--<li>点击添加酒店按钮</li>-->
          <!--<li>在地图上新增一个酒店</li>-->
          <!--<li>改变酒店类型</li>-->
        </ul>
        <input type="button" class="edit-button" value="新增酒店" id="btnAddFeature" />
        <input type="button" class="edit-button" value="新增line" id="btnAddLine" @click="addLine" />
        <input type="button" class="edit-button" value="新增ring" id="btnAddRing" />
      </div>

      <div id="updateInstructionDiv" style="text-align:center">
        <p class="or-wrap">
          <span class="or-text" style="background-color: rgba(4,95,189,0)">或</span>
        </p>
        <p>选择一个酒店编辑或删除.</p>
      </div>

      <div id="featureUpdateDiv" style="display:none; margin-top: 1em;">
        <h3 class="list-heading">进入酒店信息</h3>

        <div id="attributeArea">
          <div id="formDiv" style="background-color: rgba(4,95,189,0)"></div>
          <div id="formDiv2" style="background-color: rgba(4,95,189,0)"></div>
          <input type="button" class="edit-button" value="更新酒店信息" id="btnUpdate" />
        </div>

        <div id="deleteArea">
          <input type="button" class="edit-button" value="删除酒店" id="btnDelete" />
        </div>
      </div>
    </div>
    <div id="viewDiv"></div>
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
import { unselectFeature } from "./editMethods";

export default {
  name: "EditByPanel",
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
        "esri/Graphic",
        "esri/widgets/Expand",
        "esri/widgets/FeatureForm",
        "esri/config",
        "esri/views/2d/draw/Draw",
        "esri/geometry/Polyline",
        "dojo/domReady!"
      ]).then(
        ([
          Map,
          MapView,
          FeatureLayer,
          Graphic,
          Expand,
          FeatureForm,
          esriConfig,
          Draw,
          Polyline
        ]) => {
          esriConfig.request.corsEnabledServers.push("localhost:6080"); //设置地图服务器已允许跨域
          let editFeature,
            highlight,
            featureForm,
            featureLayer,
            featureLayer2,
            editArea,
            attributeEditing,
            updateInstructionDiv;

          featureLayer = new FeatureLayer({
            url: defaultFeatureLayer,
            outFields: ["*"],
            popupEnabled: false,
            id: "incidentsLayer"
          });

          featureLayer2 = new FeatureLayer({
            url: lineFeatureLayer,
            outFields: ["*"],
            popupEnabled: false
          });

          this.map = new Map({
            basemap: "streets", //实例化地图
            layers: [featureLayer, featureLayer2]
          });

          const view = new MapView({
            container: "viewDiv",
            map: this.map,
            zoom: 11,
            center: [123.5, 41.8],
            extent: extent
          });
          this.mapView = view;

          const draw = new Draw({
            view: view
          });

          view.when(function(evt) {
            setupEditingLine();
            //检查用户是否对要素进行点击
            view.on("click", function(event) {
              // 清楚之前选择的要素
              unselectFeature(
                attributeEditing,
                updateInstructionDiv,
                featureForm,
                highlight
              );
              //返回与点击屏幕坐标相交的图层要素
              view.hitTest(event).then(function(response) {
                // If a user clicks on an incident feature, select the feature.
                if (
                  response.results[0].graphic &&
                  response.results[0].graphic.layer.id == "incidentsLayer"
                ) {
                  selectFeature(
                    response.results[0].graphic.attributes[
                      featureLayer.objectIdField
                    ]
                  );
                }
              });
            });
          });

          function applyEdits(params) {
            unselectFeature(
              attributeEditing,
              updateInstructionDiv,
              featureForm,
              highlight
            );
            featureLayer
              .applyEdits(params)
              .then(function(editsResult) {
                //获取新增要素的objectId，调用selectFeature函数高亮改要素
                if (editsResult.addFeatureResults.length > 0) {
                  const objectId = editsResult.addFeatureResults[0].objectId;
                  selectFeature(objectId);
                }
              })
              .catch(function(error) {
                console.log("===============================================");
                console.error(
                  "[ applyEdits ] FAILURE: ",
                  error.code,
                  error.name,
                  error.message
                );
                console.log("error = ", error);
              });
          }

          function applyEditsLine(params) {
            unselectFeature(
              attributeEditing,
              updateInstructionDiv,
              featureForm,
              highlight
            );
            featureLayer2
              .applyEdits(params)
              .then(function(editsResult) {
                //获取新增要素的objectId，调用selectFeature函数高亮改要素
                if (editsResult.addFeatureResults.length > 0) {
                  const objectId = editsResult.addFeatureResults[0].objectId;
                  selectFeatureLine(objectId);
                }
              })
              .catch(function(error) {
                console.log("===============================================");
                console.error(
                  "[ applyEdits ] FAILURE: ",
                  error.code,
                  error.name,
                  error.message
                );
                console.log("error = ", error);
              });
          }
          //开始监听画线
          function enableCreateLine(draw, view) {
            const action = draw.create("polyline", {
              mode: "click"
            });
            // 获取焦点
            view.focus();

            // 顶点添加事件
            action.on("vertex-add", createPolyline);

            //顶点移除事件
            action.on("vertex-remove", createPolyline);

            // 鼠标移动事件
            action.on("cursor-update", createPolyline);

            // 绘制完成事件
            action.on("draw-complete", createPolyline);
            view.on("double-click", function() {
              // console.log(view.graphics.items[0].geometry);

              const attributes = {};
              attributes["population"] = 18;
              attributes["name"] = "DKK";
              attributes["address"] = "kfjs kke fggg";

              const ipolyline = view.graphics.items[0].geometry;
              //创建一个hotelstar为经济型的要素
              const editFeature = new Graphic({
                geometry: ipolyline,
                attributes: attributes
              });
              const edits = {
                addFeatures: [editFeature]
              };
              console.log(view.graphics.items.length);
              applyEditsLine(edits);
              //清除之前绘制
              // ipolyline = null;
              attributeEditing.style.display = "block";
              updateInstructionDiv.style.display = "none";
            });
          }

          //根据点坐标生成新的线
          function createPolyline(event) {
            //获取所有顶点
            var vertices = event.vertices;
            //清除之前绘制
            view.graphics.removeAll();
            // 生成绘制的图形
            var graphic = new Graphic({
              geometry: new Polyline({
                paths: vertices,
                spatialReference: view.spatialReference
              }),
              symbol: {
                type: "simple-line", // autocasts as new SimpleFillSymbol
                color: [4, 90, 141],
                width: 4,
                cap: "round",
                join: "round"
              }
            });
            // 将绘制的图形添加到view
            view.graphics.add(graphic);
          }

          //高亮点击的要素并展示要素表的属性
          function selectFeature(objectId) {
            // query feature from the server
            featureLayer
              .queryFeatures({
                objectIds: [objectId],
                outFields: ["*"],
                returnGeometry: true
              })
              .then(function(results) {
                if (results.features.length > 0) {
                  editFeature = results.features[0];

                  //在表中展示选中要素的属性
                  featureForm.feature = editFeature;

                  // 高亮视图中的要素
                  view
                    .whenLayerView(editFeature.layer)
                    .then(function(layerView) {
                      highlight = layerView.highlight(editFeature);
                      this.highlight = layerView.highlight(editFeature);
                    });

                  attributeEditing.style.display = "block";
                  updateInstructionDiv.style.display = "none";
                }
              });
          }

          //高亮点击的要素并展示要素表的属性
          function selectFeatureLine(objectId) {
            // query feature from the server
            featureLayer2
              .queryFeatures({
                objectIds: [objectId],
                outFields: ["*"],
                returnGeometry: true
              })
              .then(function(results) {
                if (results.features.length > 0) {
                  editFeature = results.features[0];

                  //在表中展示选中要素的属性
                  featureForm.feature = editFeature;

                  // 高亮视图中的要素
                  view
                    .whenLayerView(editFeature.layer)
                    .then(function(layerView) {
                      highlight = layerView.highlight(editFeature);
                    });

                  attributeEditing.style.display = "block";
                  updateInstructionDiv.style.display = "none";
                }
              });
          }

          // 建立编辑
          function setupEditingLine() {
            // input boxes for the attribute editing
            editArea = document.getElementById("editArea");
            updateInstructionDiv = document.getElementById(
              "updateInstructionDiv"
            );
            attributeEditing = document.getElementById("featureUpdateDiv");
            //创建一个新的要素表并设置他的图层featureLayer，要不表展示在fieldConfig指定的字段的属性
            featureForm = new FeatureForm({
              container: "formDiv",
              layer: featureLayer2,
              fieldConfig: fieldConfigLine
            });

            //监听要素表的提交事件
            featureForm.on("submit", function() {
              if (editFeature) {
                // 获取表中更新后的属性,类型为对象
                const updated = featureForm.getValues();
                //遍历更新的属性并把更新的属性赋值给矢量要素属性
                Object.keys(updated).forEach(function(name) {
                  editFeature.attributes[name] = updated[name];
                });

                // Setup the applyEdits parameter with updates.
                const edits = {
                  updateFeatures: [editFeature]
                };
                applyEdits(edits);
              }
            });

            // Expand widget for the editArea div.
            const editExpand = new Expand({
              expandIconClass: "esri-icon-edit",
              expandTooltip: "Expand Edit",
              expanded: true,
              view: view,
              content: editArea
            });

            view.ui.add(editExpand, "top-right");

            //更新选中要素的属性
            document.getElementById("btnUpdate").onclick = function() {
              //触发要素表提交事件
              featureForm.submit();
            };

            //新增Line按钮创建新的要素
            document.getElementById("btnAddLine").onclick = function() {
              console.log("12345");
              unselectFeature(
                attributeEditing,
                updateInstructionDiv,
                featureForm,
                highlight
              );

              view.graphics.removeAll(); //清楚之前的绘制
              enableCreateLine(draw, view);

              //当用户点击“新增酒店”按钮时，视图上的鼠标光标变成十字花型
              document.getElementById("viewDiv").style.cursor = "crosshair";
              editArea.style.cursor = "auto";
            };
            //点击删除按钮时，ApplyEdits被调用，被选择的要素删除
            document.getElementById("btnDelete").onclick = function() {
              // setup the applyEdits parameter with deletes.
              const edits = {
                deleteFeatures: [editFeature]
              };
              applyEdits(edits);
            };
          }

          // 建立编辑
          function setupEditing() {
            // input boxes for the attribute editing
            editArea = document.getElementById("editArea");
            updateInstructionDiv = document.getElementById(
              "updateInstructionDiv"
            );
            attributeEditing = document.getElementById("featureUpdateDiv");
            //创建一个新的要素表并设置他的图层featureLayer，要不表展示在fieldConfig指定的字段的属性
            featureForm = new FeatureForm({
              container: "formDiv",
              layer: featureLayer,
              fieldConfig: fieldConfigLine
            });

            //监听要素表的提交事件
            featureForm.on("submit", function() {
              if (editFeature) {
                // 获取表中更新后的属性,类型为对象
                const updated = featureForm.getValues();
                //遍历更新的属性并把更新的属性赋值给矢量要素属性
                Object.keys(updated).forEach(function(name) {
                  editFeature.attributes[name] = updated[name];
                });

                // Setup the applyEdits parameter with updates.
                const edits = {
                  updateFeatures: [editFeature]
                };
                applyEdits(edits);
              }
            });

            // Expand widget for the editArea div.
            const editExpand = new Expand({
              expandIconClass: "esri-icon-edit",
              expandTooltip: "Expand Edit",
              expanded: true,
              view: view,
              content: editArea
            });

            view.ui.add(editExpand, "top-right");

            //更新选中要素的属性
            document.getElementById("btnUpdate").onclick = function() {
              //触发要素表提交事件
              featureForm.submit();
            };

            //新增酒店按钮创建新的要素
            document.getElementById("btnAddFeature").onclick = function() {
              unselectFeature(
                attributeEditing,
                updateInstructionDiv,
                featureForm,
                highlight
              );
              const handler = view.on("click", function(event) {
                handler.remove();
                event.stopPropagation();

                if (event.mapPoint) {
                  const point = event.mapPoint.clone();
                  point.z = undefined;
                  point.hasZ = false;

                  const attributes = {};
                  attributes["population"] = 18;
                  attributes["name"] = "DKK";
                  attributes["address"] = "kfjs kke fggg";

                  //创建一个hotelstar为经济型的要素
                  const editFeature = new Graphic({
                    geometry: point,
                    attributes: attributes
                  });

                  const edits = {
                    addFeatures: [editFeature]
                  };
                  applyEdits(edits);
                  document.getElementById("viewDiv").style.cursor = "auto";
                } else {
                  console.error("event.mapPoint is not defined");
                }
              });

              //当用户点击“新增酒店”按钮时，视图上的鼠标光标变成十字花型
              document.getElementById("viewDiv").style.cursor = "crosshair";
              editArea.style.cursor = "auto";
            };
            //点击删除按钮时，ApplyEdits被调用，被选择的要素删除
            document.getElementById("btnDelete").onclick = function() {
              // setup the applyEdits parameter with deletes.
              const edits = {
                deleteFeatures: [editFeature]
              };
              applyEdits(edits);
            };
          }
        }
      );
    },
    addLine() {
      console.log(123);
    },
    //高亮点击的要素并展示要素表的属性
    selectFeature(objectId) {
      // query feature from the server
      featureLayer
        .queryFeatures({
          objectIds: [objectId],
          outFields: ["*"],
          returnGeometry: true
        })
        .then(function(results) {
          if (results.features.length > 0) {
            editFeature = results.features[0];

            //在表中展示选中要素的属性
            featureForm.feature = editFeature;

            // 高亮视图中的要素
            view.whenLayerView(editFeature.layer).then(function(layerView) {
              highlight = layerView.highlight(editFeature);
              this.highlight = layerView.highlight(editFeature);
            });

            attributeEditing.style.display = "block";
            updateInstructionDiv.style.display = "none";
          }
        });
    }
  }
};
</script>
<style scoped>
/* @import url('https://js.arcgis.com/4.14/esri/css/main.css'); */

html,
body,
#viewDiv {
  padding: 0;
  margin: 0;
  height: 90vh;
  width: 100vw;
}

.editArea-container {
  background: #fff;
  font-family: "Avenir Next W00", "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.5em;
  overflow: auto;
  padding: 12px 15px;
  width: 300px;
}

.edit-button:hover,
.edit-button:focus {
  background-color: #e4e4e4;
}

.inputInfo {
  font-size: 12px;
  height: 32px;
  margin-bottom: 6px;
  padding: 0 6px;
  width: 100%;
}

.list-heading {
  font-weight: normal;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #323232;
}

.edit-button {
  font-size: 14px;
  height: 32px;
  margin-top: 10px;
  width: 100%;
  background-color: transparent;
  border: 1px solid #0079c1;
  color: #0079c1;
}

.or-wrap {
  background-color: #e0e0e0;
  height: 1px;
  margin: 2em 0;
  overflow: visible;
}

.or-text {
  background: #fff;
  line-height: 0;
  padding: 0 1em;
  position: relative;
  top: -0.75em;
}

input:invalid {
  border: 1px solid red;
}

input:valid {
  border: 1px solid green;
}

/* override default style */
.esri-feature-form {
  background: #fff;
  padding: 0;
}
</style>