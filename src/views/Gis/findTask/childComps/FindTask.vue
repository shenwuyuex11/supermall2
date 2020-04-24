<!--  -->
<template>
  <div id="viewDiv">
    <div id="searchDiv">
      <label for="inputTxt">Find by City Name:</label>
      <br />
      <input style="width: 200px;" type="text" id="inputTxt" size="40" value="cns111" />
      <input type="button" value="Find" id="findBtn" />
      <img
        id="loading"
        src="https://developers.arcgis.com/javascript/latest/sample-code/tasks-find/live/ajax-loader.gif"
      />
      <br />
      <br />
      <div style="overflow-x: auto; overflow-y: auto; height: 400px;">
        <table id="tbl">
          <!-- <thead>
                <th>
                    <td>name</td>
                    <td>population</td>
                    <td>address</td>
                </th>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tabVals" :key="index">
                    <td>{{item.name}}</td>
                    <td>{{item.population}}</td>
                    <td>{{item.address}}</td>
                </tr>
          </tbody>-->
        </table>
      </div>
    </div>
    <button @click="doFind">res</button>
    <button @click="doFind2">res2</button>
  </div>
</template>

<script>
import { loadModules } from "esri-loader"; //导入esri依赖
import { mapServerUrl, featureUrl } from "./childComps/config";
export default {
  name: "InfoWin",
  data() {
    return {
      map: null,
      mapView: null,
      FindTask: null,
      FindParameters: null,
      findResults: [],
      tabVals: [{ name: "default", population: 0, address: "default" }]
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/GraphicsLayer",
        "esri/layers/FeatureLayer",
        "esri/symbols/MarkerSymbol",
        "esri/Graphic",
        "esri/tasks/FindTask",
        "esri/tasks/support/FindParameters"
      ]).then(
        ([
          Map,
          MapView,
          GraphicsLayer,
          FeatureLayer,
          MarkerSymbol,
          Graphic,
          FindTask,
          FindParameters
        ]) => {
          this.FindTask = FindTask;
          this.FindParameters = FindParameters;
          const parcelsLayer = new FeatureLayer({
            url: featureUrl,
            outFields: ["*"],
            id: "incidentsLayer"
          });

          const loadingImg = document.getElementById("loading");

          // Create a FindTask pointing to a map service
          const find = new FindTask({
            url: mapServerUrl
          });
          this.find = find;

          // Executes on each button click
          function doFind() {
            // Display loading gif to provide the user feedback on search progress
            loadingImg.style.visibility = "visible";
            // Set the search text to the value of the input box
            params.searchText = document.getElementById("inputTxt").value;
            // The execute() performs a LIKE SQL query based on the provided text value
            // showResults() is called once the promise returned here resolves
            // find.execute(params).then(showResults, rejectedPromise);

            find
              .execute(params)
              .then(showResults)
              .then(res => {
                console.log(res);
              })
              .catch(rejectedPromise);
          }

          // Set parameters to only query the Counties layer by name
          const params = new FindParameters({
            layerIds: [0],
            searchFields: ["ADDRESS"]
          });

          const map = new Map({
            basemap: "streets-navigation-vector" //实例化地图
          });
          map.add(parcelsLayer);
          this.map = map;

          const view = new MapView({
            container: "viewDiv",
            map: this.map,
            zoom: 7,

            extent: {
              xmin: 111.27418783887504,
              ymin: 27.65361115167269,
              xmax: 119.18589568326072,
              ymax: 30.663629324047992,
              spatialReference: 4326
            }
          });
          this.mapView = view;

          let resultsTable = document.getElementById("tbl");

          // Executes when the promise from find.execute() resolves
          function showResults(response) {
            let results = response.results;

            // Clear the cells and rows of the table to make room for new results
            resultsTable.innerHTML = "";

            // If no results are returned from the task, notify the user
            if (results.length === 0) {
              resultsTable.innerHTML = "<i>No results found</i>";
              loadingImg.style.visibility = "hidden";
              return;
            }

            // Set up row for descriptive headers to display results
            var topRow = resultsTable.insertRow(0);
            var cell1 = topRow.insertCell(0);
            var cell2 = topRow.insertCell(1);
            var cell3 = topRow.insertCell(2);
            cell1.innerHTML = "<b>NAME</b>";
            cell2.innerHTML = "<b>POLULATION</b>";
            cell2.innerHTML = "<b>ADDRESS</b>";

            // Loop through each result in the response and add as a row in the table
            results.forEach(function(findResult, i) {
              // Get each value of the desired attributes
              var city = findResult.feature.attributes["name"];
              var state = findResult.feature.attributes["polulation"];
              var address = findResult.feature.attributes["address"];

              // Add each resulting value to the table as a row
              var row = resultsTable.insertRow(i + 1);
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              cell1.innerHTML = city;
              cell2.innerHTML = state;
              cell3.innerHTML = address;
            });
            loadingImg.style.visibility = "hidden";
            return results;
          }

          // Executes each time the promise from find.execute() is rejected.
          function rejectedPromise(error) {
            console.error("Promise didn't resolve: ", error.message);
          }

          // Run doFind() when button is clicked
          document.getElementById("findBtn").addEventListener("click", doFind);
          document.getElementById("tbl").addEventListener("click", getTr);
          function getTr() {
            let getTr = document.getElementsByTagName("tr");
            console.log(getTr);
          }
        }
      );
    },
    res() {
      console.log(this.findResults);
    },
    // Executes on each button click
    doFind() {
      // Set parameters to only query the Counties layer by name
      // 可以根据需求决定是否返回几何信息    returnGeometry: true
      const params = new this.FindParameters({
        layerIds: [0],
        searchFields: ["ADDRESS"]
      });
      params.searchText = document.getElementById("inputTxt").value;
      // Create a FindTask pointing to a map service
      const find = new this.FindTask({
        url: mapServerUrl
      });

      find
        .execute(params)
        .then(this.showResults)
        .catch(rejectedPromise => {
          console.log(rejectedPromise);
        });
    },
    doFind2() {
      // Set parameters to only query the Counties layer by name
      // 可以根据需求决定是否返回几何信息    returnGeometry: true
      const getVal = this.doFind();
      console.log(getVal);
    },
    // Executes when the promise from find.execute() resolves
    showResults(response) {
      let results = response.results;

      let resultsTable = document.getElementById("tbl");
      const loadingImg = document.getElementById("loading");

      // Clear the cells and rows of the table to make room for new results
      resultsTable.innerHTML = "";

      // If no results are returned from the task, notify the user
      if (results.length === 0) {
        resultsTable.innerHTML = "<i>No results found</i>";
        loadingImg.style.visibility = "hidden";
        return;
      }

      // Set up row for descriptive headers to display results
      let topRow = resultsTable.insertRow(0);
      let cell1 = topRow.insertCell(0);
      let cell2 = topRow.insertCell(1);
      let cell3 = topRow.insertCell(2);
      cell1.innerHTML = "<b>NAME</b>";
      cell2.innerHTML = "<b>POLULATION</b>";
      cell2.innerHTML = "<b>ADDRESS</b>";

      // Loop through each result in the response and add as a row in the table
      results.forEach(function(findResult, i) {
        // Get each value of the desired attributes
        let city = findResult.feature.attributes["name"];
        let state = findResult.feature.attributes["polulation"];
        let address = findResult.feature.attributes["address"];

        // Add each resulting value to the table as a row
        let row = resultsTable.insertRow(i + 1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = city;
        cell2.innerHTML = state;
        cell3.innerHTML = address;
      });
      loadingImg.style.visibility = "hidden";
      return results;
    }
  }
};
</script>
<style scoped>
body {
  margin: 0; /**主要是去除谷歌浏览器默认的8像素的外边距 */
}
#viewDiv {
  height: 90vh;
  width: 100vw;
}

td {
  padding: 4px;
}

#loading {
  visibility: hidden;
}
#tbl {
  height: 310px;
  text-align: center;
}
#searchDiv {
  width: 300px;
  height: 500px;
  border: yellowgreen solid 1px;
}
</style>