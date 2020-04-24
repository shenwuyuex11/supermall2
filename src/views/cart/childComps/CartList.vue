<!--  -->
<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList" :key="index" :item-info='item'> 
      </cart-list-item>
    </scroll>
  </div>
</template>

<script>
//导入的cart内部组件
import CartListItem from "./CartListItem";

//导入公共组件
import Scroll from 'components/common/scroll/Scroll';

// 导入vuex 的getters
import { mapGetters } from "vuex";
export default {
  name: "CartList",
  data() {
    return {};
  },
  components: {
    CartListItem,
    Scroll
  },
  computed: {
    ...mapGetters({
      cartList: "cartList"
    })
  },
  activated() {
    // console.log(this.$refs.scroll.scroll);

    this.$refs.scroll.refresh();
    // console.log(this.$refs.scroll.scroll);
  },
  methods: {}
};
</script>
<style scoped>
.cart-list {
  height: calc(100% - 44px -49px);
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>