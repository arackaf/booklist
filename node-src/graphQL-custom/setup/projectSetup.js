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
  typeLiteral,
  relationshipHelpers
} = dataTypes;

const EditorialReview = {
  fields: {
    source: StringType,
    content: StringType
  }
};

const BookSummary = {
  table: "amazonReference",
  fields: {
    _id: MongoIdType,
    title: StringType,
    asin: StringType,
    isbn: StringType,
    ean: StringType,
    smallImage: StringType,
    mediumImage: StringType,
    authors: StringArrayType
  }
};

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
    dateAdded: StringType,
    editorialReviews: arrayOf(EditorialReview),
    similarItems: StringArrayType
  },
  manualQueryArgs: [
    { name: "searchChildSubjects", type: "Boolean" },
    { name: "publicUserId", type: "String" },
    { name: "bookSearchVersion", type: "String" },
    { name: "isBookDetails", type: "String" }
  ]
};

relationshipHelpers.projectIds(Book, "similarBooks", {
  type: BookSummary,
  fkField: "similarItems",
  keyField: "asin"
});

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
    resolverSources: ["../../graphQL-custom/extras/subject/resolver"],
    schemaSources: ["../../graphQL-custom/extras/subject/schema"],
    overrides: ["updateSubject", "updateSubjects", "updateSubjectsBulk", "deleteSubject"]
  },
  manualQueryArgs: [{ name: "publicUserId", type: "String" }]
};

const Tag = {
  table: "tags",
  fields: {
    _id: MongoIdType,
    name: StringType,
    path: StringType,
    userId: StringType,
    backgroundColor: StringType,
    textColor: StringType
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
    isPublic: BoolType,
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
  BookSummary,
  EditorialReview,
  Subject,
  LabelColor,
  User,
  PublicUser,
  Tag
};
