<!--  -->
<template>
  <div class="buffer">
    <div ref="viewDiv" id="viewDiv">
      <button @click="setBuffer">setBuffer</button>
      <button @click="clearBuffer">clearBuffer</button>
    </div>
  </div>
</template>

<script src="./config/base.js"></script>
<style lang='scss' scoped>
html,
body,
#viewDiv {
  padding: 0;
  margin: 0;
  height: 90vh;
  width: 100vw;
}
</style>