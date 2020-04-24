import {
  ADD_COUNTER,
  ADD_TO_CART,
  ADD_TO_FIND,
  ADD_TO_FIND2
} from './mutation-types'

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // 直接用find函数检验cartList里是否有payload对应的iid值
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      if (oldProduct) {
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前商品数量+1')
      } else {
        payload.count = 1
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  },
  addFindResults(context, payload) {
    return new Promise((resolve, reject) => {
      let oldFindValue = context.state.findTaskList.find(item => item.geometry === payload.geometry)

      if(oldFindValue){
        resolve('查到的数据已存在')
      } else {
        context.commit(ADD_TO_FIND,payload)
        resolve('添加了新的fandtask数据')
      }
    })
  },
  addEditInfos(context, payload) {
    return new Promise((resolve, reject) => {
      let oldFindValue = context.state.findTaskList.find(item => item.geometry === payload.geometry)

      context.commit(ADD_TO_FIND2,payload)

      // if(oldFindValue){
      //   resolve('添加的数据已存在')
      // } else {
      //   context.commit(ADD_TO_FIND2,payload)
      //   resolve('添加了新的空间数据')
      // }
    })
  }
}
