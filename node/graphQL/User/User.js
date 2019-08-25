import Book from "../Book/Book";

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
  },
  relationships: {
    books: {
      get type() {
        return Book;
      },
      fkField: "_id",
      keyField: "userId",
      oneToMany: true,
      __isArray: true,
      __isObject: false
    }
  }
};
