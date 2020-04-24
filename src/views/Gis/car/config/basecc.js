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
      curPosition: null,
      carGraphic: null,
      angle: 0,
      positionGraphics:[]
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
      /*初始化各种图层*/
      // let cva_c = this.initYiledLayer('cva_c'); //矢量注记
      // let vec_c = this.initYiledLayer('vec_c'); //矢量底图

      // let cia_c = this.initYiledLayer('cia_c'); //影像注记
      // let img_c = this.initYiledLayer('img_c'); //影像地图

      let vec_w = this.initYiledLayer2('vec_w'); //墨卡托矢量
      let cva_w = this.initYiledLayer2('cva_w'); //墨卡托矢量

      // this.layersInstance.cva_c = cva_c;
      // this.layersInstance.vec_c = vec_c;

      // this.layersInstance.cia_c = cia_c;
      // this.layersInstance.img_c = img_c;

      this.layersInstance.vec_w = vec_w;
      this.layersInstance.cva_w = cva_w;

      /*初始化地图 天地图 */
      // let map = new this.gisConstructor.Map({
      //   basemap: {
      //     baseLayers: [this.layersInstance.vec_w, this.layersInstance.cva_w]
      //   }
      // });

      let map = new this.gisConstructor.Map({
        basemap: "streets",
      })
      // map.on('load', function () {
      //   lineLyr = new this.gisConstructor.GraphicsLayer;
      //   lineLyr.id = 'lineLyr';
      //   map.layers.add(lineLyr);
      //   carLyr = new this.gisConstructor.GraphicsLayer;
      //   carLyr.id = 'carLyr';
      //   map.layers.add(carLyr);
      // })

      this.map = map;

      lineLyr = new this.gisConstructor.GraphicsLayer;
      lineLyr.id = 'lineLyr';


      carLyr = new this.gisConstructor.GraphicsLayer;
      carLyr.id = 'carLyr';

      this.lineLyr = lineLyr;
      this.carLyr = carLyr;

      map.layers.add(this.lineLyr);
      map.layers.add(this.carLyr);

      let view = new this.gisConstructor.MapView({
        container: container,
        map: map,
        scale: 7000000, // 限制比例尺
        center: [116.40, 39.90],
        zoom: 7,
      });

      this.view = view;

      let applicationDiv = document.createElement('div');
      this.gisInstance.map = map;
      this.gisInstance.mapView = view;
      let full = new this.gisConstructor.ScaleBar({
        view: view,
        element: applicationDiv
      });

      view.popup.autoOpenEnabled = false;

      view.ui.add(full, 'bottom-right');
    },
    initYiledLayer2(mapType) {
      let result = this.gisConstructor.WebTileLayer(
        "http://{subDomain}.tianditu.gov.cn/" + mapType +
        "/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}" +
        "&tk=55d6f64ddfde40d894b6a72a4d678f84", {
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
        }
      )
      this.layerID[mapType] = result.id;
      return result;
    },
    drawLine() {
      this.lineLyr.removeAll();
      this.carLyr.removeAll();
      let view = this.gisInstance.mapView;
      let Draw = this.gisConstructor.Draw;

      // create a new instance of draw
      const draw = new Draw({
        view: view
      });

      view.graphics.removeAll();
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
      const vertices = event.vertices;
      //清除之前绘制
      view.graphics.removeAll();



      this.points = event.vertices;
      // console.log(this.gisInstance.map);
      // 生成绘制的图形
      const graphic = new this.gisConstructor.Graphic({
        geometry: new this.gisConstructor.Polyline({
          paths: vertices,
          spatialReference: this.map.spatialReference
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
      const PictureMarkerSymbol = new this.gisConstructor.PictureMarkerSymbol;
      const Point = new this.gisConstructor.Point;
      const map = this.gisInstance.map;
      const spatialReference= this.gisInstance.mapView.spatialReference;
      this.deltaX = 0;
      this.deltaY = 0;
      this.startIdx = 0;
      this.endIdx = 1;
      // let curPosition;

      clearInterval(this.timer);

      // this.carLyr.removeAll();
      // console.log(this.gisInstance.mapView.spatialReference);
      this.curPosition = new this.gisConstructor.Point(this.points[0][0], this.points[0][1], spatialReference);
      const vec = {
        x: this.points[this.endIdx][0] - this.points[this.startIdx][0],
        y: this.points[this.endIdx][1] - this.points[this.startIdx][1]
      };
      const tmpAngle = Math.atan2(vec.y, vec.x);
      this.angle = (tmpAngle - Math.PI / 2) / Math.PI * 180;

      let picSymbol = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
        width: 32,
        height: 18,
        angle: this.angle
      };

      // Create a graphic and add the geometry and symbol to it
      this.carGraphic = new this.gisConstructor.Graphic({
        geometry: this.curPosition,
        symbol: picSymbol,
        spatialReference: 3857
      });

      // this.carLyr.add(this.carGraphic);
      this.positionGraphics.push(this.carGraphic);
      this.gisInstance.mapView.graphics.add(this.carGraphic);
      this.timer = setInterval(this.setTimer, 100)
    },
    setTimer() {
      const spatialReference= this.gisInstance.mapView.spatialReference;
      if (this.deltaX != 0 || this.deltaY != 0) {
        this.curPosition = new this.gisConstructor.Point(this.curPosition.x + this.deltaX, this.curPosition.y + this.deltaY, spatialReference);
        if (this.points[this.endIdx][0] > this.points[this.startIdx][0] && this.curPosition.x > this.points[
            this.endIdx][0]) {
          this.changePosition(this.curPosition, this.endIdx, this.startIdx, this.deltaX, this.deltaY)
        } else if (this.points[this.endIdx][0] < this.points[this.startIdx][0] && this.curPosition.x <
          this.points[this.endIdx][0]) {
            this.changePosition(this.curPosition, this.endIdx, this.startIdx, this.deltaX, this.deltaY)
        } else if (this.points[this.endIdx][1] > this.points[this.startIdx][1] && this.curPosition.y >
          this.points[this.endIdx][1]) {
            this.changePosition(this.curPosition, this.endIdx, this.startIdx, this.deltaX, this.deltaY)
        } else if (this.points[this.endIdx][1] < this.points[this.startIdx][1] && this.curPosition.y <
          this.points[this.endIdx][1]) {
            this.changePosition(this.curPosition, this.endIdx, this.startIdx, this.deltaX, this.deltaY)
        }
        let picSymbol2 = {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
          width: 32,
          height: 18,
          angle: this.angle
        };
        // this.gisInstance.map.removeAll(this.carLyr)
        // this.carLyr.remove(this.carGraphic);
        const curGraphic = new this.gisConstructor.Graphic({
          geometry: this.curPosition,
          symbol: picSymbol2,
          spatialReference: 3857
        });
        this.positionGraphics.push(curGraphic);
        this.gisInstance.mapView.graphics.add(curGraphic);
        // console.log(curGraphic);
        // this.carLyr.add(this.carGraphic);
        // this.gisInstance.map.layers.removeAll()
        // this.gisInstance.map.layers.add(this.carLyr)
      } else {
        this.curPosition = new this.gisConstructor.Point(this.curPosition.x + this.deltaX, this.curPosition.y + this.deltaY, map
          .spatialReference);
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
          url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
          width: 32,
          height: 18,
          angle: this.angle
        };
        // this.gisInstance.map.removeAll(this.carLyr)
        // this.carLyr.remove(this.carGraphic);
        this.positionGraphics.push(curGraphic);
        const curGraphic = new this.gisConstructor.Graphic({
          geometry: this.curPosition,
          symbol: picSymbol2,
          spatialReference: 3857
        });
        this.gisInstance.mapView.graphics.add(curGraphic);
        // this.carLyr.add(this.carGraphic);
        // this.gisInstance.map.layers.removeAll()
        // this.gisInstance.map.layers.add(this.carLyr)
      }
    },
    changePosition() {
      const map = this.gisInstance.map;
      this.curPosition = new this.gisConstructor.Point(this.points[this.endIdx][0], this.points[this.endIdx][1], map.spatialReference);
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
      let graphics = [];
      for(let i =0 ;i<this.positionGraphics.length;i++){
        // this.gisInstance.mapView.graphics.add(this.positionGraphics[i]);
        // console.log(this.positionGraphics[i]);
        if(this.positionGraphics[i] == undefined){
          continue;
        }
        var point = {
          type: "point", // autocasts as new Point()
          longitude: this.positionGraphics[i].geometry.longitude,
          latitude: this.positionGraphics[i].geometry.latitude
        };

        // Create a symbol for drawing the point
        var markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [226, 119, 40],
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
        };

        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new this.gisConstructor.Graphic({
          geometry: point,
          symbol: markerSymbol
        });
        console.log(this.positionGraphics[i].geometry.longitude)
        console.log(this.positionGraphics[i].geometry.latitude)
        graphics.push(pointGraphic);
      }
      this.gisInstance.mapView.graphics.addMany(graphics);
    }
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}
