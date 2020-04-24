<!--  -->
<template>
  <div ref="map" id="map" style="width: 100vw;height: 90vh;">
    <div
      style="position: absolute;right: 0px;top: 0px;width: 20%;height: 100%;background-color: #1E9FFF"
    >
      <div>
        <button id="drawLineBtn" @click="drawLine">绘制路线</button>
      </div>
      <div>
        <button id="startMoveBtn" @click="floatCar">开始移动</button>
      </div>
      <div @click="countClick"><button>count</button></div>
      <div id="cord">
        <button @click="ttt">ttt</button>
      </div>
    </div>
  </div>
</template>
<script src="./config/base.js"></script>
<style scoped>
</style>