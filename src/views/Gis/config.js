export const fieldConfig = [{
    name: "POPULATION",
    options: {
      label: "选择酒店类型"
    }
  },
  {
    name: "NAME",
    options: {
      label: "编辑酒店名称信息"
    }
  },
  {
    name: "ADDRESS",
    options: {
      label: "编辑酒店地址信息"
    }
  }
]

export const fieldConfigLine = [{
    name: "DESCRIPTION",
    options: {
      label: "选择酒店类型"
    }
  },
  {
    name: "ADDRESS",
    options: {
      label: "编辑酒店地址信息"
    }
  }
]

export const defaultFeatureLayer = "http://localhost:6080/arcgis/rest/services/Edit/editPoint/FeatureServer/0";

export const lineFeatureLayer = "http://localhost:6080/arcgis/rest/services/Edit/editLine2/FeatureServer/0";

export const extent = {
  xmin: 111.27418783887504,
  ymin: 27.65361115167269,
  xmax: 119.18589568326072,
  ymax: 30.663629324047992,
  spatialReference: 4326
}
