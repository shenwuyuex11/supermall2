import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import esriLoader from 'esri-loader' //加载esri对应的Vue库
import echarts from 'echarts'; //导入echarts
import ElementUI from 'element-ui'; //导入elementUI
import 'element-ui/lib/theme-chalk/index.css';


import FastClick from 'fastclick' //点击延迟300ms，移动端效果更好
import toast from 'components/common/toast'  //点击后的吐丝效果，vuex相关
import VueLazyLoad from 'vue-lazyload'  //图片懒加载

Vue.config.productionTip = false;
// Vue.prototype.$map = map;
Vue.prototype.$echarts = echarts;

//解决移动端300ms延迟
FastClick.attach(document.body);

Vue.use(esriLoader); //安装esriloader
Vue.use(ElementUI);

esriLoader.loadScript({
  url: 'https://js.arcgis.com/4.14/init.js',
  dojoConfig: {
    async: false
  }
})
// esriLoader.loadCss('http://localhost:8090/arcgis_js_api/library/4.13/esri/css/main.css')
esriLoader.loadCss('https://js.arcgis.com/4.14/esri/css/main.css')
// esriLoader.loadCss('https://js.arcgis.com/4.14/esri/themes/light/main.css')

//安装toast插件
Vue.use(toast)

//安装懒加载插件
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/placeholder.png')
})

// 事件总线，用来监听goodslist里的图片资源加载完毕时使用
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
