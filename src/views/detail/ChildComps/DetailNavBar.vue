<!--  -->
<template>
  <div id="detail-nav-bar">
    <nav-bar>
      <div slot="left" class="back" @click="backClick()">
        <img src="~assets/img/common/back.svg" alt />
      </div>
      <div slot="center" class="title">
        <div v-for="(item,index) in titles" 
        :key="index"
        class="title-item"
        :class="{active:currentType==index}"
        @click="itemClick(index)">
          {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
//导入NavBar公共组件
import NavBar from "components/common/navbar/NavBar"; //导航页

export default {
  name: "DetailNavBar",
  data() {
    return {
      titles: ["商品", "参数", "评论", "推荐"],
      currentType: 0,
    }
  },
  components: {
    NavBar
  },
  methods: {
      itemClick(index) {
          // console.log(index)
          this.currentType = index
          this.$emit('titleClick',index)
      },
      backClick() {
          this.$router.back()
        //   this.$router.go(-1) //这也可以
        // this.$router.forward() //向前跳转页面
      }
  },
};
</script>
<style scoped>
.title {
  display: flex;
}
.title-item {
  flex: 1;
}
.active {
  color: red;
}
.back img {
  margin-top: 12px;
}
</style>