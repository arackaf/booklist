export default {
  table: "subjects",
  typeName: "Subject",
  fields: {
    _id: "MongoId",
    name: "String",
    path: "String",
    userId: "String",
    backgroundColor: "String",
    textColor: "String",
    timestamp: "Float"
  },
  extras: {
    resolverSources: ["../../graphQL-custom/custom-content/subject/resolver"],
    schemaSources: ["../../graphQL-custom/custom-content/subject/schema"],
    overrides: ["updateSubject", "updateSubjects", "updateSubjectsBulk", "deleteSubject"]
  },
  relationships: {}
};
