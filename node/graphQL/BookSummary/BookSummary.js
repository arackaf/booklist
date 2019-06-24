export default {
  table: "bookSummaries",
  typeName: "BookSummary",
  fields: {
    _id: "MongoId",
    title: "String",
    asin: "String",
    isbn: "String",
    ean: "String",
    smallImage: "String",
    mediumImage: "String",
    authors: "StringArray"
  },
  relationships: {}
};
