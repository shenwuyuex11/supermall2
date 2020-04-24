<!--  -->
<template>
  <div class="field-panel">
      <label for="field-div"></label>
      <div id="field-div">
          <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
  name: "FieldPanel",
  data() {
    return {};
  }
};
</script>
<style scoped>
</style>