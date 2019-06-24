export default {
  table: "users",
  typeName: "PublicUser",
  fields: {
    _id: "MongoId",
    isPublic: "String",
    publicName: "String",
    publicBooksHeader: "String"
  },
  relationships: {}
};
