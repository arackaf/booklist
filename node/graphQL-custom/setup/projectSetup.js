import { dataTypes, createGraphqlSchema, dbHelpers } from "mongo-graphql-starter";
const { MongoIdType, StringType, StringArrayType, BoolType, IntType, FloatType, arrayOf } = dataTypes;

export const EditorialReview = {
  fields: {
    source: StringType,
    content: StringType
  }
};

export const BookSummary = {
  table: "bookSummaries",
  fields: {
    _id: MongoIdType,
    title: StringType,
    asin: StringType,
    isbn: StringType,
    ean: StringType,
    smallImage: StringType,
    mediumImage: StringType,
    authors: StringArrayType
  },
  readonly: true
};

export const Book = {
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
    similarItems: StringArrayType,
    similarItemsLastUpdate: IntType,
    timestamp: FloatType
  },
  manualQueryArgs: [
    { name: "searchChildSubjects", type: "Boolean" },
    { name: "publicUserId", type: "String" },
    { name: "ver", type: "String" },
    { name: "cache", type: "Int" }
  ],
  relationships: {
    similarBooks: {
      get type() {
        return BookSummary;
      },
      fkField: "similarItems",
      keyField: "isbn"
    }
  }
};

export const Subject = {
  table: "subjects",
  fields: {
    _id: MongoIdType,
    name: StringType,
    path: StringType,
    userId: StringType,
    backgroundColor: StringType,
    textColor: StringType,
    timestamp: FloatType
  },
  extras: {
    resolverSources: ["../../graphQL-custom/extras/subject/resolver"],
    schemaSources: ["../../graphQL-custom/extras/subject/schema"],
    overrides: ["updateSubject", "updateSubjects", "updateSubjectsBulk", "deleteSubject"]
  },
  manualQueryArgs: [{ name: "publicUserId", type: "String" }, { name: "ver", type: "String" }, { name: "cache", type: "Int" }]
};

export const Tag = {
  table: "tags",
  fields: {
    _id: MongoIdType,
    name: StringType,
    path: StringType,
    userId: StringType,
    backgroundColor: StringType,
    textColor: StringType,
    timestamp: FloatType
  },
  manualQueryArgs: [{ name: "publicUserId", type: "String" }, { name: "ver", type: "String" }, { name: "cache", type: "Int" }]
};

export const LabelColor = {
  table: "labelColors",
  fields: {
    _id: MongoIdType,
    backgroundColor: StringType,
    order: IntType
  },
  readonly: true,
  extras: {
    overrides: ["getLabelColor"]
  },
  manualQueryArgs: [{ name: "ver", type: "String" }, { name: "cache", type: "Int" }]
};

export const User = {
  table: "users",
  fields: {
    isPublic: BoolType,
    publicName: StringType,
    publicBooksHeader: StringType
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
      readonly: true
    }
  }
};

export const PublicUser = {
  table: "users",
  fields: {
    isPublic: StringType,
    publicName: StringType,
    publicBooksHeader: StringType
  },
  readonly: true,
  manualQueryArgs: [{ name: "cache", type: "Int" }]
};

export const SubjectsDeleted = {
  table: "subjectsDeleted",
  readonly: true,
  fields: {
    userId: StringType,
    deletedTimestamp: FloatType
  }
};

export const TagsDeleted = {
  table: "tagsDeleted",
  readonly: true,
  fields: {
    userId: StringType,
    deletedTimestamp: FloatType
  }
};

export const BooksDeleted = {
  table: "booksDeleted",
  readonly: true,
  fields: {
    userId: StringType,
    deletedTimestamp: FloatType
  }
};
