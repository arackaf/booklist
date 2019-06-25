import EditorialReview from "../EditorialReview/EditorialReview";
import BookSummary from "../BookSummary/BookSummary";

export default {
  table: "books",
  typeName: "Book",
  fields: {
    _id: "MongoId",
    ean: "String",
    isbn: "String",
    title: "String",
    smallImage: "String",
    mediumImage: "String",
    userId: "String",
    publisher: "String",
    publicationDate: "String",
    pages: "Int",
    authors: "StringArray",
    subjects: "StringArray",
    tags: "StringArray",
    isRead: "Boolean",
    dateAdded: "String",
    editorialReviews: {
      __isArray: true,
      get type() {
        return EditorialReview;
      }
    },
    similarItems: "StringArray",
    similarItemsLastUpdate: "Int",
    timestamp: "Float"
  },
  relationships: {
    similarBooks: {
      get type() {
        return BookSummary;
      },
      fkField: "similarItems",
      keyField: "isbn",
      manyToMany: true,
      __isArray: true,
      __isObject: false
    }
  }
};
