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
    smallImagePreview: "JSON",
    mediumImage: "String",
    mediumImagePreview: "JSON",
    authors: "StringArray"
  },
  extras: {
    overrides: ["createBookSummary", "updateBookSummarys", "updateBookSummarysBulk", "deleteBookSummary"]
  },
  relationships: {}
};
