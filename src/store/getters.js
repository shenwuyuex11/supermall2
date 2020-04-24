const getters = {
    cartList(state) {
      return state.cartList
    },
    cartCount(state, getters) {
      return getters.cartList.length
    },
    findTask(state) {
      return state.findTaskList
    },
    findTask2(state) {
      return state.editInfo //存储edit面板里输入的属性信息
    }
  }
  
  export default getters