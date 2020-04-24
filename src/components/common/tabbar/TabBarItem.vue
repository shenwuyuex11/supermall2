<!--  -->
<template>
  <div class="tab-bar-item" @click="itemClick()">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div class="title" :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  data() {
    return {

    };
  },
  props: {
    path: {
      type: String
    },
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  computed: {
    activeStyle() {
      return this.isActive ? {color:this.activeColor} : {}
    },
    isActive() {
      return this.$route.path.indexOf(this.path) !== -1
    }
  },
  methods: {
    itemClick() {
      if(this.$route.path != this.path){
        // console.log(this.$route.path)
        // console.log(this.path)
        // console.log('*********************')
        this.$router.replace(this.path)
      }
      else{
        // return
        // this.$router.replace(this.$route.path)  //这样会报错是否可以刷新呢？？？
      }
    }
  }
};
</script>
<style scoped>
.tab-bar-item{
  flex: 1;
  text-align: center;
  height: 49px;
}
.tab-bar-item img{
    width:24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
}
.active{
    color: blueviolet;
}
</style>