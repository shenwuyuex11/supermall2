import {
  loadCss,
  loadModules,
  setDefaultOptions,
  /*setDefalutOptions*/
} from 'esri-loader';
//vuex
import {
  mapActions
} from 'vuex';
import {
  gisModules
} from './config';
/*加载特定版本的API*/
// setDefaultOptions({version: 'next'})

export default {
  name: 'BaseMap',
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
      lineLyr: {},
      carLyr: {},
      timer: {},
      points: [],
      curPosition: null,
      speed: 45,
      deltaX: null,
      deltaY: null,
      startIdx: null,
      endIdx: null,
      carGraphic: null,
      angle: 0,
      index: 0,
      startPoint: [116.40, 39.90],
      events: {}
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

      // 地图得是投影坐标系
      // 小车图标的车头方向朝上
      let lineLyr;
      let carLyr;
      // 作为 map 容器的标签
      let container = this.$refs.map;

      /*处理构造函数，绑定到gisConstructor,方便组件内其他函数调用gis api 的模块*/
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop();
        this.gisConstructor[name] = args[k];
      }



      let map = new this.gisConstructor.Map({
        basemap: "streets",
      })
      lineLyr = new this.gisConstructor.GraphicsLayer;
      lineLyr.spatialReference = 3857;
      lineLyr.id = 'lineLyr';
      map.layers.add(lineLyr);
      carLyr = new this.gisConstructor.GraphicsLayer;
      carLyr.spatialReference = 3857;
      carLyr.id = 'carLyr';
      map.layers.add(carLyr);

      this.map = map;
      this.lineLyr = lineLyr;
      this.carLyr = carLyr;

      let view = new this.gisConstructor.MapView({
        container: container,
        map: map,
        // center: [116.40, 39.90],
        zoom: 7,
        
        // spatialReference: {
        //   latestWkid: 3857,
        //   wkid: 102100
        // }
      });
      // Set the extent on the view
      view.extent = new this.gisConstructor.Extent({
        spatialReference: {
          latestWkid: 3857,
          wkid: 102100
        },
        xmax: 12969378.614158977,
        xmin: 12944001.520768333,
        ymax: 4865114.227141439,
        ymin: 4841418.748373066
      });

      this.view = view;

      let applicationDiv = document.createElement('div');
      this.gisInstance.map = map;
      this.gisInstance.mapView = view;

      // First create a point geometry (this is the location of the Titanic)

      const firstPosition = new this.gisConstructor.Point(12969378.614158977, 4841418.748373066, 3857);
      let picSymbol = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
        width: 32,
        height: 18,
        angle: 30
      };
      let firstGraphic = new this.gisConstructor.Graphic(firstPosition, picSymbol);
      this.carGraphic = firstGraphic
      carLyr.add(firstGraphic);
      let full = new this.gisConstructor.ScaleBar({
        view: view,
        element: applicationDiv
      });

      view.popup.autoOpenEnabled = false;

      view.ui.add(full, 'bottom-right');
    },
    drawLine() {
      clearInterval(this.timer)
      this.lineLyr.graphics.removeAll();
      this.carLyr.graphics.removeAll();
      let view = this.gisInstance.mapView;
      let Draw = this.gisConstructor.Draw;

      // create a new instance of draw
      const draw = new Draw({
        view: view
      });

      const action = draw.create("polyline", {
        mode: "click"
      });
      // 获取焦点
      view.focus();

      // 顶点添加事件
      action.on("vertex-add", this.createPolyline);


      //顶点移除事件
      action.on("vertex-remove", this.createPolyline);


      // 鼠标移动事件
      action.on("cursor-update", this.createPolyline);


      // 绘制完成事件
      action.on("draw-complete", this.createPolyline);
    },

    //根据点坐标生成新的线
    createPolyline(event) {
      const view = this.gisInstance.mapView;
      //获取所有顶点
      const vertices = event.vertices

      view.graphics.removeAll();
      this.events = event;
      this.points = event.vertices;
      // 生成绘制的图形
      const graphic = new this.gisConstructor.Graphic({
        geometry: new this.gisConstructor.Polyline({
          paths: vertices,
          spatialReference: {
            latestWkid: 3857,
            wkid: 102100
          }
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
      // this.lineLyr.add(graphic);
      view.graphics.add(graphic);
    },
    floatCar() {
      this.deltaX = 0;
      this.deltaY = 0;
      this.startIdx = 0;
      this.endIdx = 1;

      clearInterval(this.timer);

      this.carLyr.removeAll();
      const vec = {
        x: this.points[this.endIdx][0] - this.points[this.startIdx][0],
        y: this.points[this.endIdx][1] - this.points[this.startIdx][1]
      };
      const tmpAngle = Math.atan2(vec.y, vec.x);
      this.angle = (tmpAngle - Math.PI / 2) / Math.PI * 180;

      let picSymbol2 = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
        width: 32,
        height: 18,
        angle: 30
      };
      let firstP = this.gisConstructor.webMercatorUtils.xyToLngLat(this.points[0][0], this.points[0][1]);
      this.curPosition = new this.gisConstructor.Point(firstP, 4326);

      // Create a graphic and add the geometry and symbol to it
      this.carGraphic = new this.gisConstructor.Graphic(this.curPosition, picSymbol2);
      this.carLyr.graphics.add(this.carGraphic);
      this.timer = setInterval(this.setTimer, 100)
    },
    setTimer() {
      if (this.deltaX != 0 || this.deltaY != 0) {
        
        if(this.curPosition.spatialReference.isWGS84){
          let curP = this.gisConstructor.webMercatorUtils.lngLatToXY(this.curPosition.x, this.curPosition.y);
          this.curPosition = new this.gisConstructor.Point({x:curP[0] + this.deltaX, y:curP[1] + this.deltaY, spatialReference:3857});
        } else{
          this.curPosition = new this.gisConstructor.Point({x:this.curPosition.x + this.deltaX, y:this.curPosition.y + this.deltaY, spatialReference:3857});
        }
        if (this.points[this.endIdx][0] > this.points[this.startIdx][0] && this.curPosition.x > this.points[
            this.endIdx][0]) {
          this.changeDirection(this.curPosition, this.endIdx, this.startIdx, this.deltaX, this.deltaY)
        } else if (this.points[this.endIdx][0] < this.points[this.startIdx][0] && this.curPosition.x <
          this.points[this.endIdx][0]) {
          this.changeDirection(this.curPosition, this.endIdx, this.startIdx, this.deltaX, this.deltaY)
        } else if (this.points[this.endIdx][1] > this.points[this.startIdx][1] && this.curPosition.y >
          this.points[this.endIdx][1]) {
          this.changeDirection(this.curPosition, this.endIdx, this.startIdx, this.deltaX, this.deltaY)
        } else if (this.points[this.endIdx][1] < this.points[this.startIdx][1] && this.curPosition.y <
          this.points[this.endIdx][1]) {
          this.changeDirection(this.curPosition, this.endIdx, this.startIdx, this.deltaX, this.deltaY)
        }
        let picSymbol2 = {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: "https://tu.duoduocdn.com/logo/logo_o3x_02.png",
          width: 32,
          height: 18,
          angle: this.angle
        };

        this.carLyr.graphics.removeAll();
        const curGraphic = new this.gisConstructor.Graphic({
          geometry: this.curPosition,
          symbol: picSymbol2,
          spatialReference: 3857
        });
        this.carLyr.graphics.add(curGraphic);
      } else {
        this.curPosition = new this.gisConstructor.Point(this.curPosition.x + this.deltaX, this.curPosition.y + this.deltaY, 4326);
        const vec = {
          x: this.points[this.endIdx][0] - this.points[this.startIdx][0],
          y: this.points[this.endIdx][1] - this.points[this.startIdx][1]
        };
        const tmpAngle = Math.atan2(vec.y, vec.x);
        this.deltaX = Math.cos(tmpAngle) * this.speed;
        this.deltaY = Math.sin(tmpAngle) * this.speed;
        this.angle = (tmpAngle - Math.PI / 2) / Math.PI * 180;
        let picSymbol2 = {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: "https://tu.duoduocdn.com/logo/logo_o3x_02.png",
          width: 32,
          height: 18,
          angle: this.angle
        };

        this.carLyr.graphics.remove(curGraphic);
        const curGraphic = new this.gisConstructor.Graphic({
          geometry: this.curPosition,
          symbol: picSymbol2,
          spatialReference: 3857
        });
        this.carLyr.graphics.add(curGraphic);
      }
    },
    changeDirection() {
      const map = this.gisInstance.map;
      // this.curPosition = new this.gisConstructor.Point(this.points[this.endIdx][0], this.points[this.endIdx][1], 3857);
      this.curPosition = new this.gisConstructor.Point({x:this.points[this.endIdx][0] + this.deltaX, y:this.points[this.endIdx][1] + this.deltaY, spatialReference:3857});
      if (this.endIdx == this.points.length - 1) {
        clearInterval(this.timer)
      } else {
        this.startIdx++;
        this.endIdx++;
      }
      const vec = {
        x: this.points[this.endIdx][0] - this.points[this.startIdx][0],
        y: this.points[this.endIdx][1] - this.points[this.startIdx][1]
      };
      const tmpAngle = Math.atan2(vec.y, vec.x);
      this.deltaX = Math.cos(tmpAngle) * this.speed;
      this.deltaY = Math.sin(tmpAngle) * this.speed;
      this.angle = (tmpAngle - Math.PI / 2) / Math.PI * 180;
    },
    countClick() {
      let picSymbol2 = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
        width: 32,
        height: 18,
        angle: 30
      };
      const firstPosition = new this.gisConstructor.Point(this.points[0][0], this.points[0][1], 3857);
      // const firstPosition = new this.gisConstructor.Point(this.startPoint[0], this.startPoint[1], 3857);
      this.carGraphic = new this.gisConstructor.Graphic(firstPosition, picSymbol2);

      this.carLyr.graphics.add(this.carGraphic);
      this.index = 0;

      clearInterval(this.timer);

      this.timer = setInterval(this.changeP, 100)
    },
    ttt() {
      console.log(this.points);
      console.log(this.carLyr.graphics);
    },
    changeP() {
      // this.carLyr.graphics.removeAll();
      this.index++;
      const Point = this.gisConstructor.Point;
      const Graphic = this.gisConstructor.Graphic;
      this.carLyr.graphics.remove(this.carGraphic);
      let picSymbol = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
        width: 32,
        height: 18,
        angle: 30
      };
      let curPosition = new Point(this.startPoint[0] + (this.index / 100), this.startPoint[1] + (this.index / 100), 4326);
      this.carGraphic = new Graphic(curPosition, picSymbol);

      this.carLyr.graphics.add(this.carGraphic);
      if (this.index > 100) {
        clearInterval(this.timer)
      }
    }
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}
