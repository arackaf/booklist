export default {
  table: "subjects",
  typeName: "Subject",
  fields: {
    _id: "MongoId",
    name: "String",
    path: "String",
    userId: "String",
    backgroundColor: "String",
    textColor: "String"
  },
  extras: {
    resolverSources: ["../../../graphQL-custom/extras/subject/resolver-public"],
    schemaSources: ["../../../graphQL-custom/extras/subject/schema"],
    overrides: ["updateSubject", "updateSubjects", "updateSubjectsBulk", "deleteSubject"]
  },
  relationships: {}
};
