<template>
  <div class="home">
    <div class="tool-btn">
      <div>
      </div>
    </div>
    <div ref="map" id="map" style="width: 100vw;height: 90vh;">
      <div id="searchDiv">
        <label for="inputTxt">Find by City Name:</label>
        <br />
        <input style="width: 200px;" type="text" id="inputTxt" size="40" value="cns111" />
        <input type="button" value="Find" id="findBtn" @click="doFind"/>
        <img
          id="loading"
          src="https://developers.arcgis.com/javascript/latest/sample-code/tasks-find/live/ajax-loader.gif"
        />
        <br />
        <br />
        <div>
          <table>
            <tr :id="index" v-for="(item, index) in findResults" :key="index" @click="gotoGraphic(index)">
              <td>{{item.name}}</td>
              <td>{{item.address}}</td>
              <td>{{item.population}}</td>
              <!-- <td style="display:none;">{{item.geometry}}</td> -->
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./childComps/base.js"></script>
<style scoped>
.home {
  height: 100vh;
  background: #cccccc;
  position: relative;
}

td {
  padding: 4px;
}

#loading {
  visibility: hidden;
}
#tbl {
  text-align: center;
}
#searchDiv {
  width: 300px;
  height: 500px;
  border: yellowgreen solid 1px;
}
</style>