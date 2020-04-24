import {
  ADD_COUNTER,
  ADD_TO_CART,
  ADD_TO_FIND,
  ADD_TO_FIND2  //用来存储edit面板里添加的数据
} from './mutation-types'

export default {
  [ADD_COUNTER](state, payload) {
    payload.count++;
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true  //商品选择后的状态
    state.cartList.push(payload)
  },
  [ADD_TO_FIND](state, payload) {
    state.findTaskList.push(payload)
  },
  [ADD_TO_FIND2](state, payload) {
    state.editInfo = [];
    state.editInfo.push(payload)
  }
}
