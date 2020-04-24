<!--  -->
<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">商品分类</div>
    </nav-bar>
    <tab-control v-show="isTabFixed" class="tab-control" ref="tabControl1" :titles="titles" @tabClick="tabClick"></tab-control>
    <scroll 
    class="content" ref="scroll" 
    :probe-type="3" 
    :pull-up-load="true" 
    @pullingUp="loadMore"
    @scroll="contentScroll">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend-View :recommends="recommend"></home-recommend-View>
      <feature-view></feature-view>
      <tab-control ref="tabControl2" :titles="titles" @tabClick="tabClick"></tab-control>
      <goods-list :goods="currentGoods"></goods-list>
    </scroll>
    <!-- <back-top @backClick='backClick()'></back-top> -->
    <back-top @click.native="backClick()" v-show="showBackTop"></back-top>
  </div>
</template>

<script>
//调用的通用型公共组件
import NavBar from "components/common/navbar/NavBar"; //导航页

//调用的项目内公共组件
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";

// home文件夹内的子组件
import HomeSwiper from "./ChildComps/HomeSwiper";
import HomeRecommendView from "./ChildComps/HomeRecommendView";
import FeatureView from "./ChildComps/FeatureView";

// 第三方插件
import Scroll from "components/common/scroll/Scroll";

//公共方法
import {debounce} from 'common/utils';
//混入
import {itemListenerMixin, backTopMixin} from 'common/mixin';

//公共常量
import {NEW, POP, SELL, BACKTOP_DISTANCE} from 'common/const'

//网络请求
import { getHomeMultidata, getHomeGoods } from "network/home";

export default {
  name: "Home",
  data() {
    return {
      banners: [],
      recommend: [],
      titles: ["流行", "新款", "精选"],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY:0,
      showBackTop: false,
      itemImgListener: null
    };
  },
  mixins:[itemListenerMixin, backTopMixin],
  components: {
    NavBar,
    HomeSwiper,
    HomeRecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll
  },
  created() {
    //获取轮播图的网络资源
    this.getHomeMultidata();

    //获取tabControl下面的goodsList商品列表数据
    this.getHomeGoods(POP);
    this.getHomeGoods(NEW);
    this.getHomeGoods(SELL);
  },
  computed: {
    currentGoods: {
      // console.log(this.currentType)
      get() {
        return this.goods[this.currentType].list;
      },
      set(val) {}
    }
  },
  mounted() {
    // 因为在created里面获取元素并操作容易出现undefined，毕竟mounted里才是Dom加载完成，所欲在
    //这里调用下tabClick并初始化tabControl的商品选项。
    this.tabClick(0);
  },
  methods: {
    // 回到顶部
    backClick() {
      this.$refs.scroll.scrollTo(0,0,400);
    },
    //下拉加载更多
    loadMore() {
      console.log("more");
      this.getHomeGoods(this.currentType);
      this.$refs.scroll.refresh();
    },
    // 切换goodslist展示的商品类型
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          // console.log(this.currentType)
          break;
        case 1:
          this.currentType = "new";
          // console.log(this.currentType)
          break;
        case 2:
          this.currentType = "sell";
          // console.log(this.currentType)
          break;

        default:
          break;
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    contentScroll(position) {
      //决定backtop是否显示
      this.showBackTop = (-position.y) > BACKTOP_DISTANCE
      

      // 决定tabControl是否吸顶（positon:fixed）
      this.isTabFixed = (-position.y) > this.tabOffsetTop;
    },

    //获取tabControl的offsetTop
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      // console.log(this.tabOffsetTop) //打印的是图片加载后的整个元素高度，和mounted里的只是基本样式加载完的高度不同。
    },

    // 网络请求的方法
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res.data)
        this.banners = res.data.banner.list;
        this.recommend = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        this.goods[type].list.push(...res.data.list);
        this.currentGoods = res.data.list;
        this.goods[type].page += 1;

        //完成一次上拉后要执行一次finnishPullUp，否则下次上拉就不起效了。
        this.$refs.scroll.finishPullUp();
        // console.log(this.goods[type].list)
      });
    }
  },
  activated() {
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY()
    this.$bus.$off("itemImageLoad",this.itemImgListener)
  },
  beforeDestroy() {
    console.log('beforeDestory')
  },
};
</script>
<style scoped>
#home {
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
}
.tab-control {
  position: relative;

  z-index: 9;
}
.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/* 在做吸顶的时候这种方式行不通，所以该类不再使用 */
.fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
}
</style>