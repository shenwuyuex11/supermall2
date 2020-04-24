<!--  -->
<template>
  <div class="cmit">
      <button v-for="(item,index) in movies" :key="index" @click="itemClick(item)">{{item.name}}</button>
  </div>
</template>

<script>
export default {
  name: "Cmit",
  data() {
    return {
        movies: [
            {name:'卡卡罗特',age:'117'},
            {name:'贝吉塔',age:'121'},
            {name:'tom',age:'22'},
            {name:'jery',age:'12'}
        ]
    };
  },
  methods:{
      itemClick(item) {
        console.log(item.name+'的年纪是'+item.age+'岁');
          this.$emit('ageClick',item)
      }
  }
};
</script>
<style lang='scss' scoped>
</style>