import { dataTypes } from "mongo-graphql-starter";
const {
  MongoIdType,
  MongoIdArrayType,
  StringType,
  StringArrayType,
  BoolType,
  IntType,
  IntArrayType,
  FloatType,
  FloatArrayType,
  DateType,
  arrayOf,
  objectOf,
  formattedDate,
  typeLiteral
} = dataTypes;

const Book = {
  table: "books",
  fields: {
    _id: MongoIdType,
    ean: StringType,
    isbn: StringType,
    title: StringType,
    smallImage: StringType,
    mediumImage: StringType,
    userId: StringType,
    publisher: StringType,
    publicationDate: StringType,
    pages: IntType,
    authors: StringArrayType,
    subjects: StringArrayType,
    tags: StringArrayType,
    isRead: BoolType,
    dateAdded: StringType
  },
  manualQueryArgs: [{ name: "searchChildSubjects", type: "Boolean" }, { name: "publicUserId", type: "String" }]
};

const Subject = {
  table: "subjects",
  fields: {
    _id: MongoIdType,
    name: StringType,
    path: StringType,
    userId: StringType,
    backgroundColor: StringType,
    textColor: StringType
  },
  extras: {
    resolverSources: ["../../graphQL-extras/subject/resolver"],
    schemaSources: ["../../graphQL-extras/subject/schema"],
    overrides: ["updateSubject", "updateSubjects", "updateSubjectsBulk"]
  },
  manualQueryArgs: [{ name: "publicUserId", type: "String" }]
};

const LabelColor = {
  table: "labelColors",
  fields: {
    _id: MongoIdType,
    backgroundColor: StringType,
    order: IntType
  },
  extras: {
    overrides: ["getLabelColor", "updateLabelColor", "updateLabelColors", "updateLabelColorsBulk", "createLabelColor", "deleteLabelColor"]
  }
};

const User = {
  table: "users",
  fields: {
    isPublic: StringType,
    publicName: StringType,
    publicBooksHeader: StringType
  },
  extras: {
    overrides: ["createUser", "updateUsers", "updateUsersBulk", "deleteUser"]
  }
};

const PublicUser = {
  table: "users",
  fields: {
    isPublic: StringType,
    publicName: StringType,
    publicBooksHeader: StringType
  },
  extras: {
    overrides: ["updatePublicUser", "updatePublicUsers", "updatePublicUsersBulk", "createPublicUser", "deletePublicUser"]
  }
};

export default {
  Book,
  Subject,
  LabelColor,
  User,
  PublicUser
};
