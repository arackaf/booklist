export default {
  table: "users",
  typeName: "User",
  fields: {
    _id: "MongoId",
    isPublic: "String",
    publicName: "String",
    publicBooksHeader: "String"
  },
  extras: {
    overrides: ["createUser", "updateUsers", "updateUsersBulk", "deleteUser"]
  }
};