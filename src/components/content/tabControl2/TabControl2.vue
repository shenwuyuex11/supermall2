<!--  -->
<template>
  <div :class="['tabs',{'tabs-collapse':isCollapse}]">
    <el-menu default-active="1-1">
      <div v-for="(item, index) in tabArr" :key="index">
        <el-submenu :index="String(index+1)" v-if="item.childFlag">
          <template slot="title">
            <i></i>
            <span slot="title">{{item.name}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              :index="itemChild.index"
              v-for="(itemChild, indexChild) in item.tabChild"
              :key="indexChild"
            >{{itemChild.content}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "TabControl2",
  data() {
    return {
      tabArr: [
        {
          name: "数据可视化",
          icon: "icon-shuju",
          childFlag: true,
          tabChild: [
            { index: "1-1", content: "普通echarts", routerData: "comEcharts" }
          ]
        }
      ]
    };
  },
  props: {
    isCollapse: {
      type: Boolean,
      value: true
    }
  }
};
</script>
<style lang='scss' scoped>
/*覆盖组件样式*/
.el-menu-vertical-demo {
  height: 600px;
  width: 54px;
  text-align: left;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu-item:hover,
.el-submenu__title:hover {
  background-color: #1f2d3d !important;
}
.el-menu-item-group__title {
  display: none;
}

.tabs {
  .open-tabs {
    width: 180px;
    height: 56px;
    line-height: 56px;
    text-align: left;
    color: rgb(191, 203, 217);
    background-color: rgb(48, 65, 86);
    padding-left: 10px;
    cursor: pointer;
  }
  .close-tabs {
    width: 34px;
  }
  .tabs-content {
    margin-left: 10px;
  }
}
</style>