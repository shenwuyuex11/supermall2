<!--  -->
<template>
  <div class="home">
    <div class="top">
      <div>
        <img class="top-img" src="~assets/img/avactor.png" alt />
        <span></span>
      </div>
    </div>

    <div :class="['tab',{'tab-collapse':!shrinkFlag}]">
      <tab-control :isCollapse="!shrinkFlag"></tab-control>
    </div>
  </div>
</template>

<script>
import TabControl from "components/content/tabControl2/TabControl2";
export default {
  name: "Home",
  data() {
    return {
      shrinkFlag: true
    };
  },
  components: {
    TabControl
  }
};
</script>
<style lang="scss" scoped>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
.home {
  width: 100%;
  height: 100%;
  .top {
    display: flex;
    width: calc(100% - 20px);
    height: 60px;
    font-size: 30px;
    line-height: 60px;
    text-align: left;
    color: rgb(64, 158, 255);
  }
  .top-name {
    float: left;
    width: 140px;
    text-align: left;
    font-size: 20px;
    margin-left: 4px;
  }
  .top-img {
    width: 30px;
    height: 30px;
    float: left;
    margin: 15px 0 0 10px;
    border-radius: 6px;
  }

  .tab {
    float: left;
    height: calc(100% - 60px);
    overflow-y: auto;
    overflow-x: hidden;
    background-color: rgb(48, 65, 86);

    // 导航未折叠
    .tabs {
      width: 200px;
      height: 100%;
      .el-menu {
        height: 100%;
      }
    }

    // 导航折叠
    .tabs-collapse {
      width: 55px;
    }
    .tab-collapse {
      width: 55px;
    }
  }
  .router-child {
    float: right;
    width: calc(100% - 211px);
    height: calc(100% - 96px);
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
  }
  .router-child-shrink {
    width: calc(100% - 61px);
  }
  .el-tag {
    cursor: pointer;
  }
}

//顶部样式
.home {
  .top {
    position: relative;
  }

  //左侧标题和logo
  .top-left {
    width: 200px;
    background: #1f2d3d;
  }
  .top-left-shrink {
    width: 54px;
  }
  .top-name {
    color: #ffffff;
  }

  //收缩导航
  .top-shrink {
    margin-left: 8px;
    cursor: pointer;
    color: #303133;
    line-height: 60px;
    .more-sanhengxian {
      font-weight: 700;
    }
    .iconfont {
      font-size: 22px;
    }
  }

  //面包屑
  .top-crumbs {
    margin-left: 20px;
    .el-breadcrumb {
      line-height: 60px;
    }
  }

  //右侧内容
  .top-right {
    height: 60px;
    position: absolute;
    right: 0;
    .right-full {
      position: absolute;
      right: 100px;
      cursor: pointer;
      span {
        font-size: 26px;
        color: #909399;
      }
    }
    .login-img {
      position: absolute;
      right: 20px;
      width: 40px;
      height: 40px;
      margin-top: 8px;
      border-radius: 6px;
      cursor: pointer;
    }
    .login-text {
      color: #ffffff;
    }
  }
}
</style>