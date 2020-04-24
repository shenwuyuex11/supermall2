<!--  -->
<template>
  <div class="panel">
    <edit-panel ref="editPanel" id="edit-panel">
      <label for="wkt-input">wkt:</label>
      <br />
      <input id="wkt-input" type="number" value="-49.97" />
      <input id="wkt-input2" type="number" value="41.73" />
    </edit-panel>
    <field-panel id="field-panel">
      <div class="fieldDiv">
        <label for="iptName">NAME:</label>
        <br />
        <input id="iptName" type="text" value="DKK" />
      </div>
      <div class="fieldDiv">
        <label for="iptAddr">ADDR:</label>
        <br />
        <input id="iptAddr" type="text" value="shenwuyuexy" />
      </div>
      <div class="fieldDiv">
        <label for="iptPop">POP:</label>
        <br />
        <input id="iptPop" type="number" value="18" />
      </div>
    </field-panel>
    <control-panel id="control-panel">
      <div id="add-div">
        <label for="btnAdd"></label>
        <button id="btnAdd" @click="addClick">添加</button>
      </div>
      <div id="show-div">
        <label for="btnAdd"></label>
        <show-map2></show-map2>
      </div>
      <div id="dele-div">
        <label for="btnAdd"></label>
        <button id="btnAdd" @click="deleteFeature">删除</button>
      </div>
    </control-panel>
    <gis-mehtods id="gis-methods" ref="gisMehtods"></gis-mehtods>
    <show-map :show="show"></show-map>
  </div>
</template>

<script>
import EditPanel from "./EditPanel";
import FieldPanel from "./FieldPanel";
import ControlPanel from "./ControlPanel";
import GisMehtods from "./GisMethods";
import ShowMap from "./ShowMap";
import ShowMap2 from "./ShowMap2";

//vuex
import { mapActions } from "vuex";

export default {
  name: "Panel",
  data() {
    return {
      show: false
    };
  },
  components: {
    EditPanel,
    FieldPanel,
    ControlPanel,
    GisMehtods,
    ShowMap,
    ShowMap2
  },
  methods: {
    addClick() {
      // console.log(this.$refs.gisMehtods);
      let lat = Number(document.getElementById("wkt-input").value);
      let lon = Number(document.getElementById("wkt-input2").value);
      let name = document.getElementById("iptName").value;
      let addr = document.getElementById("iptAddr").value;
      let popu = Number(document.getElementById("iptPop").value);
      console.log(name);
      console.log(addr);
      console.log(popu);

      let point = {
        type: "point", // autocasts as new Point()
        longitude: lon,
        latitude: lat
      };

      // Create a symbol for drawing the point
      var markerSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40],
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 2
        }
      };

      // Create a graphic and add the geometry and symbol to it
      let pointGraphic = new this.$refs.gisMehtods.gisConstructor.Graphic({
        geometry: point,
        symbol: markerSymbol
      });
      // console.log(pointGraphic);
      this.addFeature(point, popu, name, addr);
    },
    addFeature(geometry, popu, name, addr) {
      // Typical usage
      const featureLayer = new this.$refs.gisMehtods.gisConstructor.FeatureLayer(
        {
          // URL to the service http://localhost:6080/arcgis/rest/services/Edit/editPoint/FeatureServer/0
          url:
            "http://localhost:6080/arcgis/rest/services/Edit/editPoint/FeatureServer/0"
        }
      );
      const attributes = {};
      attributes["population"] = popu;
      attributes["name"] = name;
      attributes["address"] = addr;

      // Date.now() returns number of milliseconds elapsed
      // since 1 January 1970 00:00:00 UTC.
      // attributes["Report_Date"] = Date.now();

      const addFeature = new this.$refs.gisMehtods.gisConstructor.Graphic({
        geometry: geometry,
        attributes: attributes
      });

      // or specify globalIds of features to be deleted
      // const deleteFeature = [
      //  { globalId: "18633204-1801-4d35-a73a-174563608ad9" }
      // ];

      const promise = featureLayer
        .applyEdits({
          addFeatures: [addFeature]
        })
        .then(res => {
          console.log("添加成功");
          const product = {};
          product.name = name;
          product.addr = addr;
          product.popu = popu;

          //添加数据到vuex,即添加到store
          // this.$store.dispatch('addCart', product).then(res => {
          //   console.log('添加了商品')
          // });

          this.addEditInfos(product).then(res => {
            this.$toast.show(res, 2000);
          });
        })
        .then(res => {
          console.log("字段信息添加到仓库");
        })
        .catch(err => {
          console.log("添加失败");
        });
    },
    open() {
      this.show = true;
    },
    ...mapActions(["addEditInfos"]),
    addToEditInfos() {
      // console.log('添加到购物车');
      let name = document.getElementById("iptName").value;
      let addr = document.getElementById("iptAddr").value;
      let popu = Number(document.getElementById("iptPop").value);
      const product = {};
      product.name = name;
      product.addr = addr;
      product.popu = popu;

      //添加数据到vuex,即添加到store
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log('添加了商品')
      // });

      this.addEditInfos(product).then(res => {
        this.$toast.show(res, 2000);
      });
    },
    deleteFeature() {
      const featureLayer = new this.$refs.gisMehtods.gisConstructor.FeatureLayer(
        {
          // URL to the service http://localhost:6080/arcgis/rest/services/Edit/editPoint/FeatureServer/0
          url:
            "http://localhost:6080/arcgis/rest/services/Edit/editPoint/FeatureServer/0"
        }
      );

      const query = new this.$refs.gisMehtods.gisConstructor.Query();
      const queryTask = new this.$refs.gisMehtods.gisConstructor.QueryTask({
        url: "http://localhost:6080/arcgis/rest/services/Edit/editPoint/FeatureServer/0"
      });
      const name = document.getElementById('iptName').value;
      query.where = "name= '" + name+"'";  //注意拼接方式
      // query.where = "name ='" + "zxc'";
      // query.outSpatialReference = {
      //   wkid: 102100
      // };
      // query.returnGeometry = true;
      query.outFields = ["*"];
      const deleteFeatures = [];
      queryTask.execute(query).then(function(results) {
        // Results.graphics contains the graphics returned from query
        for (let index = 0; index < results.features.length; index++) {
          const element = {objectId:results.features[index].attributes.OBJECTID};
          deleteFeatures.push(element);
        }
        console.log(deleteFeatures);
        // Create a symbol for drawing the point
      });

      // const deleteFeatures = [{ objectId: 3 }, { objectId: 4 }]; //按照objectId删除要素

      featureLayer
        .applyEdits({
          deleteFeatures: deleteFeatures
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
#edit-panel {
  margin-top: 20px;
  padding-top: 20px;
}
#field-panel {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 4px;
}
#iptName {
  width: 150px;
}
#iptAddr {
  width: 150px;
}
#iptPop {
  width: 150px;
}
#add-div {
  display: inline;
  margin-left: 3px;
  margin-right: 5px;
}
#show-div {
  display: inline;
  margin-left: 3px;
  margin-right: 5px;
}
#dele-div {
  display: inline;
  margin-left: 3px;
  margin-right: 5px;
}
#fieldDiv {
  margin: 3px;
}

#edit-panel {
  width: 245px;
  margin-right: 10px;
}
#wkt-input {
  width: 150px;
}
#wkt-input2 {
  width: 150px;
}
</style>