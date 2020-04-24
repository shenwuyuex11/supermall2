import {
  loadCss,
  loadModules,
  setDefaultOptions,
  /*setDefalutOptions*/
} from 'esri-loader';

import tileInfo from './tileInfo';
import {
  gisModules,
  showServerUrl,
  layerViewUrl,
  hotelsFeatureLayerUrls
} from './config';
/*加载特定版本的API*/
// setDefaultOptions({version: 'next'})

export default {
  name: 'HotelFeatures',
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
      findResultsGeo: [],
      viewLayerPoints: {}, //viewLayer方式highlight所用的图层
      highlight: null //高亮
    }
  },
  components: {},
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
      // 作为 map 容器的标签
      let container = this.$refs.viewDiv;
      let editFeature, highlight,  editArea, attributeEditing, updateInstructionDiv;

      /*处理构造函数，绑定到gisConstructor,方便组件内其他函数调用gis api 的模块*/
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop();
        this.gisConstructor[name] = args[k];
      }
      /*初始化各种图层*/
      let cva_c = this.initYiledLayer('cva_c'); //矢量注记
      let vec_c = this.initYiledLayer('vec_c'); //矢量底图

      let cia_c = this.initYiledLayer('cia_c'); //影像注记
      let img_c = this.initYiledLayer('img_c'); //影像地图

      this.layersInstance.cva_c = cva_c;
      this.layersInstance.vec_c = vec_c;

      this.layersInstance.cia_c = cia_c;
      this.layersInstance.img_c = img_c;

      const pointsFeatureLayer = new this.gisConstructor.FeatureLayer({
        url: hotelsFeatureLayerUrls[0].Url,
        outFields: ["*"],
        popupEnabled: false,
        id: "incidentsPoints"
      });

      const linesFeatureLayer = new this.gisConstructor.FeatureLayer({
        url: hotelsFeatureLayerUrls[1].Url,
        outFields: ["*"],
        popupEnabled: false,
        id: "incidentsLines"
      });

      const ringsFeatureLayer = new this.gisConstructor.FeatureLayer({
        url: hotelsFeatureLayerUrls[2].Url,
        outFields: ["*"],
        popupEnabled: false,
        id: "incidentsRings"
      });

      const featureLayer = new this.gisConstructor.FeatureLayer({
        url: "http://localhost:6080/arcgis/rest/services/EditFeatures/EditFeatures/FeatureServer/0",
        outFields: ["*"],
        popupEnabled: false,
        id: "incidentsLayer"
      });

      // viewLayer方式highlight用到的图层
      const viewLayerPoints = new this.gisConstructor.FeatureLayer({
        url: layerViewUrl,
        outFields: ["*"],
        // popupTemplate: popupTemplate  //需要根据图层的字段名创建popup模板
      });
      this.viewLayerPoints = viewLayerPoints;

      /*初始化地图 */
      let map = new this.gisConstructor.Map({
        spatialReference: {
          wkid: 4326
        },
        basemap: {
          baseLayers: [this.layersInstance.vec_c, this.layersInstance.cva_c]
        },
        layers: [pointsFeatureLayer, linesFeatureLayer, ringsFeatureLayer]
      });
      map.layers.add(viewLayerPoints);
      this.map = map;
      let view = new this.gisConstructor.MapView({
        container: container,
        spatialReference: {
          wkid: 4326
        },
        map: map,
        scale: 7000000, // 限制比例尺
        center: [111.42610500035, 33.76651600041],
      });

      this.view = view;
      let applicationDiv = document.createElement('div');
      this.gisInstance.map = map;
      this.gisInstance.mapView = view;
      let full = new this.gisConstructor.ScaleBar({
        view: view,
        element: applicationDiv
      });
      this.gisInstance.view = view;

      view.popup.autoOpenEnabled = false;

      view.ui.add(full, 'bottom-right');

      setupEditing();

      function applyEdits(params) {
        unselectFeature();
        pointsFeatureLayer.applyEdits(params).then(function (editsResult) {
            //获取新增要素的objectId，调用selectFeature函数高亮改要素
            if (editsResult.addFeatureResults.length > 0) {
              const objectId = editsResult.addFeatureResults[0].objectId;
              selectFeature(objectId);
            }
          })
          .catch(function (error) {
            console.log("===============================================");
            console.error("[ applyEdits ] FAILURE: ", error.code, error.name,
              error.message);
            console.log("error = ", error);
          });
      }


      //检查用户是否对要素进行点击
      view.on("click", function (event) {
        // 清楚之前选择的要素
        unselectFeature();
        //返回与点击屏幕坐标相交的图层要素
        view.hitTest(event).then(function (response) {
          // If a user clicks on an incident feature, select the feature.
          if (response.results[0].graphic && response.results[0].graphic.layer.id ==
            "incidentsLayer") {
            selectFeature(response.results[0].graphic.attributes[featureLayer
              .objectIdField]);
          }
        });
      });


      //高亮点击的要素并展示要素表的属性
      function selectFeature(objectId) {
        // query feature from the server
        featureLayer.queryFeatures({
          objectIds: [objectId],
          outFields: ["*"],
          returnGeometry: true
        }).then(function (results) {
          if (results.features.length > 0) {
            editFeature = results.features[0];


            //在表中展示选中要素的属性
            featureForm.feature = editFeature;

            // 高亮视图中的要素
            view.whenLayerView(editFeature.layer).then(function (layerView) {
              highlight = layerView.highlight(editFeature);
            });

            attributeEditing.style.display = "block";
            updateInstructionDiv.style.display = "none";
          }
        });
      }


      // 移除高亮的要素和属性
      function unselectFeature() {
        attributeEditing.style.display = "none";
        updateInstructionDiv.style.display = "block";
        featureForm.feature = null;
        if (highlight) {
          highlight.remove();
        }
      }

      // 建立编辑
      function setupEditing() {
        // input boxes for the attribute editing
        editArea = document.getElementById("editArea");
        updateInstructionDiv = document.getElementById("updateInstructionDiv");
        attributeEditing = document.getElementById("featureUpdateDiv");

        let editArea = document.getElementById("formDiv");
        //创建一个新的要素表并设置他的图层featureLayer，要不表展示在fieldConfig指定的字段的属性
        console.log(this.gisConstructor);
        let FeatureForm = this.gisConstructor.FeatureForm
        
        let featureForm = new FeatureForm({
          container: "formDiv2",
          layer: featureLayer,
          fieldConfig: [{
              name: "HOTELSTAR",
              options: {
                label: "选择酒店类型"
              }
            },
            {
              name: "NAME",
              options: {
                label: "编辑酒店名称信息"
              }
            },
            {
              name: "ADDR",
              options: {
                label: "编辑酒店地址信息"
              }
            }
          ]
        });

        //监听要素表的提交事件
        featureForm.on("submit", function () {
          if (editFeature) {
            // 获取表中更新后的属性,类型为对象
            const updated = featureForm.getValues();
            //遍历更新的属性并把更新的属性赋值给矢量要素属性
            Object.keys(updated).forEach(function (name) {
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
        document.getElementById("btnUpdate").onclick = function () {
          //触发要素表提交事件
          featureForm.submit();
        }

        //新增酒店按钮创建新的要素
        document.getElementById("btnAddFeature").onclick = function () {
          unselectFeature();
          const handler = view.on("click", function (event) {
            handler.remove();
            event.stopPropagation();

            if (event.mapPoint) {
              point = event.mapPoint.clone();
              point.z = undefined;
              point.hasZ = false;

              const attributes = {};
              attributes["NAME"] = "This is the description";
              attributes["ADDR"] = "380 New York St";
              attributes["HOTELSTAR"] = "19";

              //创建一个hotelstar为经济型的要素
              editFeature = new Graphic({
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
        }
        //点击删除按钮时，ApplyEdits被调用，被选择的要素删除
        document.getElementById("btnDelete").onclick = function () {
          // setup the applyEdits parameter with deletes.
          const edits = {
            deleteFeatures: [editFeature]
          };
          applyEdits(edits);
        }
      }
    },
    initYiledLayer(mapType) {
      let result = this.gisConstructor.WebTileLayer(
        'http://{subDomain}.tianditu.com/DataServer?T=' + mapType +
        '&X={col}&Y={row}&L={level}' +
        '&tk=55d6f64ddfde40d894b6a72a4d678f84', {
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          tileInfo: tileInfo,
          spatialReference: {
            wkid: 4326
          },
        }
      )
      this.layerID[mapType] = result.id;
      return result;
    },
    queryHighLight(name) {
      const viewLayerPoints = this.viewLayerPoints; //被高亮要素所在图层
      let highlight;
      const view = this.gisInstance.view;
      view.whenLayerView(viewLayerPoints).then(function (layerView) {
        const query = viewLayerPoints.createQuery();
        query.where = "name = '" + name + "'";
        viewLayerPoints.queryFeatures(query).then(function (result) {
          if (highlight) {
            highlight.remove();
          }
          console.log(typeof (layerView.highlight));
          this.highlight = layerView.highlight(result.features);
        })
      })
    },
    clickHighLight() {
      const view = this.gisInstance.view;
      const viewLayerPoints = this.viewLayerPoints; //被高亮要素所在图层
      view.on("click", function (event) {
        view.hitTest(event).then(function (response) {
          if (response.results.length) {
            const graphic = response.results.filter(function (result) {
              return result.graphic.layer === viewLayerPoints;
            })[0].graphic;

            view.whenLayerView(graphic.layer).then(function (layerView) {
              layerView.highlight(graphic);
            })
          }
        })
      })
    },
    moveHighLight() {
      const view = this.gisInstance.view;
      const viewLayerPoints = this.viewLayerPoints; //被高亮要素所在图层
      view.when().then(function () {
        view.whenLayerView(viewLayerPoints).then(function (layerView) {
          let highlight;
          // listen for the pointer-move event on the View
          view.on("pointer-move", function (event) {
            // Perform a hitTest on the View
            view.hitTest(event).then(function (event) {
              // Make sure graphic has a popupTemplate
              let results = event.results.filter(function (result) {
                return result.graphic;
              });
              let result = results[0];
              console.log(results[0]);
              if (result !== undefined) {
                highlight && highlight.remove();
                // Update the graphic of the Feature widget
                // on pointer-move with the result
                if (result) {
                  // feature.graphic = result.graphic;
                  highlight = layerView.highlight(result.graphic);
                } else {
                  // feature.graphic = graphic;
                }
              }
            });
          });
        });
        // view.on("pointer-move", function (event) {
        //   view.hitTest(event).then(function (response) {
        //     if (response.results.length) {
        //       const graphic = response.results.filter(function (result) {
        //         return result.graphic.layer === viewLayerPoints;
        //       })[0].graphic;

        //       view.whenLayerView(graphic.layer).then(function (layerView) {
        //         layerView.highlight(graphic);
        //       })
        //     } else {
        //       layerView.highlight();
        //     }
        //   })
        // })
      })
    },
    removeHighLight() {
      console.log(this.highlight);
    },
    // 建立编辑
    setupEditing() {
      console.log(this.gisConstructor)
      console.log(this.gisConstructor.Graphic)
    },
    addFeature(geometry) {

      const featureLayer = new this.gisConstructor.FeatureLayer({
        url: "http://localhost:6080/arcgis/rest/services/EditFeatures/EditFeatures/FeatureServer/0",
        outFields: ["*"],
        // popupTemplate: popupTemplate  //需要根据图层的字段名创建popup模板
      });

      const point = {
        type: "point", // autocasts as new Point()
        longitude: -49.97,
        latitude: 41.73
      };
      const attributes = {};
      attributes["NAME"] = "This is the description";
      attributes["ADDR"] = "380 New York St";
      attributes["HOTELSTAR"] = "19";

      // Date.now() returns number of milliseconds elapsed
      // since 1 January 1970 00:00:00 UTC.
      // attributes["Report_Date"] = Date.now();

      const addFeature = new this.gisConstructor.Graphic({
        geometry: point,
        attributes: attributes
      });

      // or specify globalIds of features to be deleted
      // const deleteFeature = [
      //  { globalId: "18633204-1801-4d35-a73a-174563608ad9" }
      // ];

      const promise = featureLayer.applyEdits({
        addFeatures: [addFeature]
      }).then(res => {
        console.log(res);
      });
    }
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}
