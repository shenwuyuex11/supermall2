<!--  -->
<template>
  <div id="category">
    <p>category</p>
    <back-top @backClick="backClick2()"></back-top>
    <button @click="gisClick">gisClick</button>
    <button @click="infoClick">Info页</button>
    <button @click="editClick">EditByPanel页</button>
    <button @click="queryClick">查询</button>
    <button @click="queryClick2">查询2</button>
    <button @click="gotoClick">定位</button>
    <button @click="findTask">findTask</button>
    <button @click="test3">test3</button>
    <button @click="tanchuang">弹窗</button>
    <button @click="floatingCar">浮动车</button>
    <button @click="echart1Click">echart1</button>
    <button @click="editClick">HotelEdit</button>
    <button @click="bufferClick">bufferEdit</button>
  </div>
</template>

<script>
import BackTop from "components/content/backTop/BackTop";
export default {
  name: "Category",
  data() {
    return {};
  },
  components: {
    BackTop
  },
  methods: {
    backClick2() {
      console.log("123");
    },
    test3() {
      this.$router.push("/test3");
    },
    gisClick() {
      this.$router.push("/gis1");
    },
    infoClick() {
      this.$router.push("/info");
    },
    editClick() {
      this.$router.push("/editByPanel");
    },
    queryClick() {
      this.$router.push("/query");
    },
    queryClick2() {
      this.$router.push("/query2");
    },
    gotoClick() {
      this.$router.push("/goto");
    },
    findTask() {
      this.$router.push("/findTask");
    },
    tanchuang() {
      this.$router.push("/test4");
    },
    floatingCar() {
      this.$router.push("/floatingCar")
    },
    echart1Click() {
      this.$router.push("/comEcharts")
    },
    editClick() {
      this.$router.push("/hotelEdit")
    },
    bufferClick() {
      this.$router.push("/buffer")
    }
  }
};
</script>
<style scoped>
</style>