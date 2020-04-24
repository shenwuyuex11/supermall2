<!--  -->
<template>
  <div class="tab-control">
    <div class="tab-control-item"
     v-for="(item,index) in titles" :key="index"
     @click="itemClick(index)"
     :class="{active: index===currentIndex}"
     ><span>{{item}}</span></div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  data() {
    return {
        currentIndex:0,
    };
  },
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods:{
      itemClick(index) {
          this.currentIndex = index
          this.$emit('tabClick',index)
      }
  }
};
</script>
<style scoped>
.tab-control {
  display: flex;
  text-align: center;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  background-color: #fff;
}
.tab-control-item {
  flex: 1;
}
.active{
    color: #ff5777;
}

.active span{
    border-bottom: 3px solid var(--color-tint);
}
</style>