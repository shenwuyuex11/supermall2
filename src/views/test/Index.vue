<!--  -->
<template>
  <div class="index">
      <emit-test @ageClick="ageClick"></emit-test>
  </div>
</template>

<script>
import EmitTest from './childComps/Emit'

export default {
  name: "Index",
  data() {
    return {};
  },
  components:{
      EmitTest
  },
  methods: {
      ageClick(item) {
          console.log(item)
      }
  },
};
</script>
<style lang='scss' scoped>
</style>