<template>
    <el-container>
    <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>

    <el-dialog :visible.sync="dialogVisible" width="50%" style=" text-align: center;" :before-close="handleClose">
      <!-- <repassword></repassword> -->
      <span>弹窗内容</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
</el-container>
</template>
<script>
// import repassword from './component/repassword'//引入密码修改模板
  export default {
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    },
    components:{    
      // repassword
    }
  };
</script>
<style scoped>
</style>