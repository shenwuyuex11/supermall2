<!--  -->
<template>
  <div class="control-panel">
      <div>
          <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
  name: "ControlPanel",
  data() {
    return {};
  }
};
</script>
<style scoped>
.control-panel {
  width: 245px;
  margin-right: 10px;
}
</style>