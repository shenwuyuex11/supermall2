<!--  -->
<template>
  <div>
      <p>注意VM这个变量的使用，直接在filters里调用this.arrayList获取不到数据</p>
    <h1 v-text="filtersTitle"></h1>
    <input v-model="filtersText" />
    <div>{{filtersText | filtersTextChange}}</div>
  </div>
</template>

<script>
let vm = {};
export default {
  name: "test1",
  data() {
      vm =this;
    return {
      filtersTitle: "vue过滤器学习，filters",
      arrayList: [
        {
          code: "1",
          value: "北京市"
        },
        {
          code: "2",
          value: "上海市"
        },
        {
          code: "3",
          value: "广州市"
        },
        {
          code: "4",
          value: "深圳市"
        },
        {
          code: "5",
          value: "杭州市"
        },
        {
          code: "6",
          value: "天津市"
        },
        {
          code: "7",
          value: "西安市"
        },
        {
          code: "8",
          value: "武汉市"
        },
        {
          code: "9",
          value: "长沙市"
        }
      ],
      filtersText: "1"
    };
  },
  filters: {
    filtersTextChange: function(dataStr) {
      let arrayList = vm.arrayList;
      let value = "没有这个城市 ";
      for (let b of arrayList) {
        if (b.code == dataStr) {
          value = b.value;
          break;
        }
      }
      return value;
    }
  }
  //   data() {
  //     return {
  //       filtersTitle: "vue过滤器学习，filters",
  //       arrayList: [
  //         {
  //           code: "1",
  //           value: "北京市"
  //         },
  //         {
  //           code: "2",
  //           value: "上海市"
  //         },
  //         {
  //           code: "3",
  //           value: "广州市"
  //         },
  //         {
  //           code: "4",
  //           value: "深圳市"
  //         },
  //         {
  //           code: "5",
  //           value: "杭州市"
  //         },
  //         {
  //           code: "6",
  //           value: "天津市"
  //         },
  //         {
  //           code: "7",
  //           value: "西安市"
  //         },
  //         {
  //           code: "8",
  //           value: "武汉市"
  //         },
  //         {
  //           code: "9",
  //           value: "长沙市"
  //         }
  //       ],
  //       filtersText: "1"
  //     };
  //   },
  //   filters: {
  //     filtersTextChange: function(dataStr) {
  //       let arrayList = this.arrayList;
  //       let value = "没有这个城市 ";
  //       for (let b of arrayList) {
  //         if (b.code == dataStr) {
  //           value = b.value;
  //           break;
  //         }
  //       }
  //       return value;
  //     }
  //   }
};
</script>
<style scoped>
</style>