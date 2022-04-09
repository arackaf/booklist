import { dataTypes, createGraphqlSchema, dbHelpers } from "mongo-graphql-starter";
const { MongoIdType, StringType, StringArrayType, BoolType, IntType, FloatType, arrayOf, JSONType, fieldOf } = dataTypes;

export const EditorialReview = {
  fields: {
    source: StringType,
    content: StringType
  }
};

export const BookSummary = {
  table: "bookSummaries",
  fields: {
    _id: fieldOf(MongoIdType).nonQueryable(),
    title: StringType,
    asin: StringType,
    isbn: StringType,
    ean: fieldOf(StringType).nonQueryable(),
    smallImage: StringType,
    smallImagePreview: fieldOf(JSONType).nonQueryable(),
    mediumImage: fieldOf(StringType).nonQueryable(),
    mediumImagePreview: fieldOf(JSONType).nonQueryable(),
    authors: StringArrayType
  },
  extras: {
    overrides: ["createBookSummary", "updateBookSummarys", "updateBookSummarysBulk", "deleteBookSummary"]
  }
};

export const Book = {
  table: "books",
  fields: {
    _id: MongoIdType,
    ean: fieldOf(StringType).nonQueryable(),
    isbn: StringType,
    title: StringType,
    mobileImage: fieldOf(StringType).nonQueryable(),
    mobileImagePreview: fieldOf(JSONType).nonQueryable(),
    smallImage: fieldOf(StringType).nonQueryable(),
    smallImagePreview: fieldOf(JSONType).nonQueryable(),
    mediumImage: fieldOf(StringType).nonQueryable(),
    mediumImagePreview: fieldOf(JSONType).nonQueryable(),
    userId: StringType,
    publisher: StringType,
    publicationDate: fieldOf(StringType).nonQueryable(),
    pages: IntType,
    authors: StringArrayType,
    subjects: StringArrayType,
    tags: StringArrayType,
    isRead: BoolType,
    dateAdded: StringType,
    editorialReviews: fieldOf(arrayOf(EditorialReview)).nonQueryable(),
    similarItems: fieldOf(StringArrayType).nonQueryable(),
    similarItemsLastUpdate: fieldOf(IntType).nonQueryable(),
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
    backgroundColor: fieldOf(StringType).nonQueryable(),
    textColor: fieldOf(StringType).nonQueryable(),
    timestamp: FloatType
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
    _id: MongoIdType,
    name: StringType,
    path: StringType,
    userId: StringType,
    backgroundColor: fieldOf(StringType).nonQueryable(),
    textColor: fieldOf(StringType).nonQueryable(),
    timestamp: FloatType
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
    _id: MongoIdType,
    backgroundColor: fieldOf(StringType).nonQueryable(),
    order: fieldOf(IntType).nonQueryable()
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
