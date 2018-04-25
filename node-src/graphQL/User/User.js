export default {
  table: "users",
  typeName: "User",
  fields: {
    _id: "MongoId",
    isPublic: "Boolean",
    publicName: "String",
    publicBooksHeader: "String"
  },
  extras: {
    overrides: ["createUser", "updateUsers", "updateUsersBulk", "deleteUser"]
  }
};