<!--  -->
<template>
  <div id="home-swiper">
    <swiper>
      <swiper-item v-for="(item,index) in banners" :key="index">
        <a :href='item.link'>
          <img :src='item.image' alt @load="imageLoad" />
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "home-swiper",
  data() {
    return {
      isLoad:false
    };
  },
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods:{
    imageLoad() {
      if (!this.isLoad) {
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
    },
  }
};
</script>
<style scoped>
</style>