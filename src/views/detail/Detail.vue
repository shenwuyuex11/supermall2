<!--  -->
<template>
  <div class="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <Scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <ul>
        <li v-for="(item,index) in $store.state.cartList" :key="index">{{item.count}}</li>
      </ul>
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detailInfo="detailInfo" @detailImageLoad="detailImageLoad"></detail-goods-info>
      <detail-param-info ref="param" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </Scroll>
    <detail-bottom-bar @addToCart="addToCart()"></detail-bottom-bar>
    <back-top @click.native="backToTop" v-show="isShowBackTop"></back-top>
    <!-- <detail-goods-item :detailInfo="goods"></detail-goods-item> -->
  </div>
</template>

<script>
//调用的通用型公共组件
import DetailNavBar from "./ChildComps/DetailNavBar"; //导航页

//调用detail内部子组件
import DetailSwiper from "./ChildComps/DetailSwiper";
import DetailBaseInfo from "./ChildComps/DetailBaseInfo";
import DetailShopInfo from "./ChildComps/DetailShopInfo";
import DetailGoodsInfo from "./ChildComps/DetailGoodsInfo";
import DetailParamInfo from "./ChildComps/DetailParamInfo";
import DetailCommentInfo from "./ChildComps/DetailCommentInfo";
import DetailBottomBar from "./ChildComps/DetailBottomBar";

//调用项目内部content公共组件
import GoodsList from "components/content/goods/GoodsList";

// 第三方插件
import Scroll from "components/common/scroll/Scroll";

//公共方法
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin"; //混入

//vuex
import { mapActions } from 'vuex';

//网络请求模块导入
import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";

export default {
  name: "Detail",
  data() {
    return {
      iid: {
        type: String
      },
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      themeTopYs: [0, 1000, 2000, 3000],
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      itemImgListener: null,
      getThemeTopY: null,
      currentIndex: 0
    };
  },
  mixins: [itemListenerMixin, backTopMixin],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    Scroll,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar
    // DetailGoodsItem
  },
  created() {
    // this.iid = this.$route.params.iid  //params和默认传值两种方式接收
    this.iid = this.$route.params.iid;

    // 发送网络请求依据iid的值获取数据
    this.getDetail(this.iid);

    //发送网络请求获取推荐商品信息
    this.getRecommend();

    //给getThemeTopY 赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_SAFE_INTEGER);

      //console.log(this.themeTopYs);
    }, 100);
  },
  methods: {
    testClick() {
      console.log(this.iid);
    },
    ...mapActions(['addCart']),
    addToCart() {
      // console.log('添加到购物车');
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //添加数据到vuex,即添加到store
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log('添加了商品')
      // });

      this.addCart(product).then(res => {
        this.$toast.show(res, 2000);
      })
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      //1.获取y值
      const positionY = -position.y;

      //2.将positionY的值和主题中的值进行对比
      let length = this.themeTopYs.length;
      // for(let i = 0; i < length; i++){
      //   if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >=  this.themeTopYs[i]))){
      //     this.currentIndex = i;
      //     this.$refs.nav.currentIndex = this.currentIndex;
      //   }
      // }
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentType = this.currentIndex;
        }
      }
      this.listenShowBackTop(position);
    },

    detailImageLoad() {
      this.newRefresh();
      this.getThemeTopY();
    },

    //网络请求方法封装
    getDetail(iid) {
      getDetail(iid).then(res => {
        // console.log(typeof(res.result.itemInfo.topImages))
        //网络请求结果
        const data = res.result;

        //获取顶部轮播图信息
        this.topImages = data.itemInfo.topImages;

        // 获取商品信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );

        //获取店铺信息
        this.shop = new Shop(data.shopInfo);

        //获取商品详细信息
        this.detailInfo = data.detailInfo;

        //获取商品参数信息
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );

        //获取用户评论信息，因为用户评论信息不一定有，所以做个判断
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
      });
    },

    //获取商品推荐信息
    getRecommend() {
      getRecommend().then(res => {
        this.recommends = res.data.list;
      });
    }
  },
  destroyed() {
    // 因为detail组件不在keep-alive里，所以要在destroyed里才能取消监听，而在keep-alive里的在deactivated里就行
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  }
};
</script>
<style scoped>
.detail {
  height: 100vh;
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  position: absolute;
  top: 44px;
  bottom: 60px;
}
/* .content {
    background-color: #fff;
    height: calc(100%-44px);
  } */
.detail-nav {
  position: relative;
  z-index: 9;
  background: #fff;
}

.back-top {
  position: fixed;
  right: 10px;
  bottom: 65px;
}
</style>