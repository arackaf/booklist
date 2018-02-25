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
    resolverSources: ["../../graphQL-extras/subject/resolver"],
    schemaSources: ["../../graphQL-extras/subject/schema"],
    overrides: ["updateSubject", "updateSubjects", "updateSubjectsBulk"]
  }
};