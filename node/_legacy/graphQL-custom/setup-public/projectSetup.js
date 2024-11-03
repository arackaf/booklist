import { dataTypes, createGraphqlSchema, dbHelpers } from "mongo-graphql-starter";
const { MongoIdType, StringType, StringArrayType, BoolType, IntType, arrayOf, JSONType, fieldOf } = dataTypes;

export const EditorialReview = {
  fields: {
    source: StringType,
    content: StringType
  }
};

export const Book = {
  table: "books",
  fields: {
    _id: MongoIdType,
    ean: StringType,
    isbn: StringType,
    title: StringType,
    mobileImage: StringType,
    mobileImagePreview: fieldOf(JSONType).nonQueryable(),
    smallImage: StringType,
    smallImagePreview: fieldOf(JSONType).nonQueryable(),
    mediumImage: StringType,
    mediumImagePreview: fieldOf(JSONType).nonQueryable(),
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
    { name: "ver", type: "String" },
    { name: "cache", type: "Int" }
  ]
};

export const Subject = {
  table: "subjects",
  fields: {
    _id: MongoIdType,
    name: StringType,
    path: StringType,
    userId: StringType,
    backgroundColor: StringType,
    textColor: StringType
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
    backgroundColor: StringType,
    textColor: StringType
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
    backgroundColor: StringType,
    order: IntType
  },
  readonly: true,
  extras: {
    overrides: ["getLabelColor"]
  }
};
