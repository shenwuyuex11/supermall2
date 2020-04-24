<!--  -->
<template>
  <div class="dialog">
    <el-dialog
      title="title"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      :show="show"
    >
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Dialog",
  data() {
    return {
      visible: this.show
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show() {
      this.visible = this.show;
    }
  }
};
</script>
<style lang='scss' scoped>
</style>