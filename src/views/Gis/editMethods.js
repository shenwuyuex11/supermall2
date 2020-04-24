// 移除高亮的要素和属性
export function unselectFeature(attributeEditing, updateInstructionDiv, featureForm, highlight) {
  attributeEditing.style.display = "none";
  updateInstructionDiv.style.display = "block";
  featureForm.feature = null;
  if (highlight) {
    highlight.remove();
  }
}

//高亮点击的要素并展示要素表的属性
export function selectFeature(objectId, featureLayer, featureForm, highlight, attributeEditing, updateInstructionDiv) {
  // query feature from the server
  featureLayer
    .queryFeatures({
      objectIds: [objectId],
      outFields: ["*"],
      returnGeometry: true
    })
    .then(function (results) {
      if (results.features.length > 0) {
        editFeature = results.features[0];

        //在表中展示选中要素的属性
        featureForm.feature = editFeature;

        // 高亮视图中的要素
        view
          .whenLayerView(editFeature.layer)
          .then(function (layerView) {
            highlight = layerView.highlight(editFeature);
            this.highlight = layerView.highlight(editFeature);
          });

        attributeEditing.style.display = "block";
        updateInstructionDiv.style.display = "none";
      }
    });
}
