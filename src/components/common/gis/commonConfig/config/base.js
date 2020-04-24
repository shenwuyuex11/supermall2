import {
  loadCss,
  loadModules,
  setDefaultOptions,
  /*setDefalutOptions*/
} from 'esri-loader';
import {
  gisModules
} from './config'
/*加载特定版本的API*/
// setDefaultOptions({version: 'next'})

export default {
  name: 'BaseMap',
  data() {
    return {
      gisConstructor: {}, //gis 构造函数
      // gisInstance: {}, // gis 实例
      gisModules: gisModules,
    }
  },
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
            /*处理构造函数，绑定到gisConstructor,方便组件内其他函数调用gis api 的模块*/
            for (let k in args) {
              let name = this.gisModules[k].split('/').pop();
              this.gisConstructor[name] = args[k];
            }
      console.log('GIS组件加载成功')
  },
},
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}
