<!--  -->
<template>
  <div class="goods-item" @click="itemClick()">
    <img v-lazy="showImage" alt @load="imgLoad" />
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  data() {
    return {};
  },
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    showImage() {
      return this.goodsItem.image || this.goodsItem.show.img
    }
  },
  methods: {
    imgLoad() {
      this.$bus.$emit("itemImageLoad");
    },
    
    // post方式路由传值 相当于get，参数例如下面的iid会以get传参方式?iid添加到detail页的URL http://localhost:8080/detail?iid=1m70y5k
    // itemClick() {
    //   this.$router.push({
    //     path: "/detail",
    //     query: {
    //       iid: this.goodsItem.iid
    //     }
    //   });
    // },

    //params方式传参 相当于post detail页面的URL仅仅到\detail就没了 http://localhost:8080/detail
    // itemClick() {
    //   this.$router.push({
    //     name: "Detail",
    //     params: {
    //       iid: this.goodsItem.iid
    //     }
    //   });
    // },

    //最基本的路由传值方式，跳转到detail页面后，其url 为http://localhost:8080/detail/1m70y5k
    itemClick() {
      // console.log(this.goodsItem.iid)
      this.$router.push({
        path: "/detail/" + this.goodsItem.iid
      });
    }
  }
};
</script>
<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;

  width: 46%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>