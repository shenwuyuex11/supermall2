<!--  -->
<template>
  <div>

    <div ref="viewDiv" id="viewDiv">
          <div id="editArea" class="editArea-container" style="background-color: rgba(4,95,189,0.2)">
      <div id="addFeatureDiv">
        <h3 class="list-heading">空间属性编辑</h3>
        <ul style="font-size: 13px; padding-left: 1.5em;">
          <!--<li>点击添加酒店按钮</li>-->
          <!--<li>在地图上新增一个酒店</li>-->
          <!--<li>改变酒店类型</li>-->
        </ul>
        <input type="button" class="edit-button" value="新增酒店" id="btnAddFeature" />
      </div>

      <div id="updateInstructionDiv" style="text-align:center">
        <p class="or-wrap">
          <span class="or-text" style="background-color: rgba(4,95,189,0)">或</span>
        </p>
        <p>选择一个酒店编辑或删除.</p>
      </div>

      <div id="featureUpdateDiv" style="display:none; margin-top: 1em;">
        <h3 class="list-heading">进入酒店信息</h3>

        <div id="attributeArea">
          <div id="formDiv" style="background-color: rgba(4,95,189,0)"></div>
          <input type="button" class="edit-button" value="更新酒店信息" id="btnUpdate" />
        </div>

        <div id="deleteArea">
          <input type="button" class="edit-button" value="删除酒店" id="btnDelete" />
        </div>
      </div>
    </div>
      <button @click="setupEditing">123</button>
    </div>
  </div>
</template>
<script src="./config/base.js"></script>
<style scoped>
html,
body,
#viewDiv {
  padding: 0;
  margin: 0;
  height: 90vh;
  width: 100vw;
}

.editArea-container {
  background: #fff;
  font-family: "Avenir Next W00", "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.5em;
  overflow: auto;
  padding: 12px 15px;
  width: 300px;
}

.edit-button:hover,
.edit-button:focus {
  background-color: #e4e4e4;
}

.inputInfo {
  font-size: 12px;
  height: 32px;
  margin-bottom: 6px;
  padding: 0 6px;
  width: 100%;
}

.list-heading {
  font-weight: normal;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #323232;
}

.edit-button {
  font-size: 14px;
  height: 32px;
  margin-top: 10px;
  width: 100%;
  background-color: transparent;
  border: 1px solid #0079c1;
  color: #0079c1;
}

.or-wrap {
  background-color: #e0e0e0;
  height: 1px;
  margin: 2em 0;
  overflow: visible;
}

.or-text {
  background: #fff;
  line-height: 0;
  padding: 0 1em;
  position: relative;
  top: -0.75em;
}

input:invalid {
  border: 1px solid red;
}

input:valid {
  border: 1px solid green;
}

/* override default style */
.esri-feature-form {
  background: #fff;
  padding: 0;
}
</style>