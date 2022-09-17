import { dataTypes, createGraphqlSchema, dbHelpers } from "mongo-graphql-starter";
const { MongoIdType, StringType, StringArrayType, BoolType, IntType, FloatType, arrayOf, JSONType } = dataTypes;

export const EditorialReview = {
  fields: {
    source: StringType,
    content: StringType
  }
};

export const BookSummary = {
  table: "bookSummaries",
  fields: {
    _id: MongoIdType.nonQueryable().nonNull(),
    title: StringType,
    asin: StringType.limitQueriesTo(["", "in"]),
    isbn: StringType.limitQueriesTo(["", "in"]),
    ean: StringType.nonQueryable(),
    smallImage: StringType.limitQueriesTo(["", "contains"]),
    smallImagePreview: JSONType.nonQueryable(),
    mediumImage: StringType.nonQueryable(),
    mediumImagePreview: JSONType.nonQueryable(),
    authors: StringArrayType
  },
  extras: {
    overrides: ["createBookSummary", "updateBookSummarys", "updateBookSummarysBulk", "deleteBookSummary"]
  }
};

export const Book = {
  table: "books",
  fields: {
    _id: MongoIdType.nonQueryable().nonNull(),
    ean: StringType.nonQueryable(),
    isbn: StringType.limitQueriesTo(["", "in"]),
    title: StringType.nonNull().limitQueriesTo(["contains"]),
    mobileImage: StringType.nonQueryable(),
    mobileImagePreview: JSONType.nonQueryable(),
    smallImage: StringType.nonQueryable(),
    smallImagePreview: JSONType.nonQueryable(),
    mediumImage: StringType.nonQueryable(),
    mediumImagePreview: JSONType.nonQueryable(),
    userId: StringType.limitQueriesTo(["", "in"]),
    publisher: StringType.limitQueriesTo(["", "in", "contains"]),
    publicationDate: StringType.nonQueryable(),
    pages: IntType.limitQueriesTo(["", "lt", "gt"]),
    authors: StringArrayType.containsNonNull().limitQueriesTo(["textContains", "in"]),
    subjects: StringArrayType.containsNonNull().limitQueriesTo(["containsAny", "count"]),
    tags: StringArrayType.containsNonNull().limitQueriesTo(["containsAny"]),
    isRead: BoolType.limitQueriesTo(["", "ne"]),
    dateAdded: StringType.nonQueryable(),
    editorialReviews: arrayOf(EditorialReview).nonQueryable().containsNonNull(),
    similarItems: StringArrayType.nonQueryable(),
    similarItemsLastUpdate: IntType.nonQueryable(),
    timestamp: FloatType.limitQueriesTo(["lt", "gt", "lte", "gte"])
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
    _id: MongoIdType.nonQueryable().nonNull(),
    name: StringType.nonNull(),
    path: StringType.limitQueriesTo(["", "contains", "startsWith"]),
    userId: StringType.limitQueriesTo(["", "in"]),
    backgroundColor: StringType.nonQueryable(),
    textColor: StringType.nonQueryable(),
    timestamp: FloatType.limitQueriesTo(["lt", "gt"])
  },
  extras: {
    resolverSources: ["../../graphQL-custom/custom-content/subject/resolver"],
    schemaSources: ["../../graphQL-custom/custom-content/subject/schema"],
    overrides: ["updateSubject", "updateSubjects", "updateSubjectsBulk", "deleteSubject"]
  },
  manualQueryArgs: [
    { name: "publicUserId", type: "String" },
    { name: "ver", type: "String" },
    { name: "cache", type: "Int" }
  ]
};

export const Tag = {
  table: "tags",
  fields: {
    _id: MongoIdType.nonQueryable().nonNull(),
    name: StringType.nonNull(),
    path: StringType.limitQueriesTo(["", "contains", "startsWith"]),
    userId: StringType.limitQueriesTo(["", "in"]),
    backgroundColor: StringType.nonQueryable().nonNull(),
    textColor: StringType.nonQueryable().nonNull(),
    timestamp: FloatType.limitQueriesTo(["lt", "gt"])
  },
  manualQueryArgs: [
    { name: "publicUserId", type: "String" },
    { name: "ver", type: "String" },
    { name: "cache", type: "Int" }
  ]
};

export const LabelColor = {
  table: "labelColors",
  fields: {
    _id: MongoIdType.nonQueryable().nonNull(),
    backgroundColor: StringType.nonQueryable().nonNull(),
    order: IntType.nonQueryable().nonNull()
  },
  readonly: true,
  extras: {
    overrides: ["getLabelColor"]
  },
  manualQueryArgs: [
    { name: "ver", type: "String" },
    { name: "cache", type: "Int" }
  ]
};

export const SubjectsDeleted = {
  table: "subjectsDeleted",
  readonly: true,
  fields: {
    userId: StringType,
    deletedTimestamp: FloatType.limitQueriesTo(["lt", "gt"])
  }
};

export const TagsDeleted = {
  table: "tagsDeleted",
  readonly: true,
  fields: {
    userId: StringType,
    deletedTimestamp: FloatType.limitQueriesTo(["lt", "gt"])
  }
};

export const BooksDeleted = {
  table: "booksDeleted",
  readonly: true,
  fields: {
    userId: StringType,
    deletedTimestamp: FloatType.limitQueriesTo(["lt", "gt"])
  }
};
