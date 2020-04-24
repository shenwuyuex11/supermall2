<!--  -->
<template>
  <div id="detail-swiper">
      <swiper class="detail-swiper">
          <swiper-item class="item" v-for="(item,index) in topImages" :key="index">
              <img :src="item" alt="">
          </swiper-item>
      </swiper>
  </div>
</template>

<script>
// 导入swiper公共组件
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "DetailSwiper",
  data() {
    return {};
  },
  components: {
      Swiper, 
      SwiperItem
  },
  props: {
      topImages: {
          type: Array,
          default() {
              return []
          }
      }
  }
};
</script>
<style scoped>
  .detail-swiper {
    text-align: center;
    height: 300px;
    overflow: hidden;
  }
</style>