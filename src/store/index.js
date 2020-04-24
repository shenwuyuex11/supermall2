import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations';
import actions from './actions';
import getters from './getters'

//1. 安装vuex
Vue.use(Vuex)

//2.创建store对象
const state = {
  // 购物车选定的商品集合
  cartList: [],
  findTaskList: [],
  editInfo:[]
}
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

//3.挂在Vue实例上
export default store;
