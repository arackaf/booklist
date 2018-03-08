export default {
  table: "labelColors",
  typeName: "LabelColor",
  fields: {
    _id: "MongoId",
    backgroundColor: "String",
    order: "Int"
  },
  extras: {
    overrides: ["updateLabelColor", "updateLabelColors", "updateLabelColorBulk", "createLabelColor", "deleteLabelColor"]
  }
};