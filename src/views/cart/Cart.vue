<!--  -->
<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <cart-list></cart-list>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList";
import CartBottomBar from "./childComps/CartBottomBar";

// 导入vuex封装的内容
import { mapGetters } from "vuex";

export default {
  name: "Cart",
  data() {
    return {};
  },
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // 数组方式获取mapgetters里的对象
    // ...mapGetters(["cartCount","cartList"]),

    //对象方式获取mapgetters里的对象
    ...mapGetters({
      length: "cartCount",
      list: "cartList"
    })
  },
  methods: {
    testClick(ttt) {
      console.log(ttt)
    }
  }
};
</script>
<style scoped>
#cart {
  /*position: relative;*/
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}

  .cart-list {
    position: absolute;
    top: 44px;
    bottom: 49px;
    width: 100%;
  }
</style>