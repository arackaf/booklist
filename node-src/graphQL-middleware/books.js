import moment from "moment";

export default class BooksMiddleware {
  queryPreprocess(root, args, context, ast) {}
  queryMiddleware(queryPacket, root, args, context, ast) {}
  beforeInsert(objToBeInserted, root, args, context, ast) {}
  afterInsert(newObj, root, args, context, ast) {}
  beforeUpdate(match, updates, root, args, context, ast) {}
  afterUpdate(match, updates, root, args, context, ast) {}
  beforeDelete(match, root, args, context, ast) {}
  afterDelete(match, root, args, context, ast) {}
  adjustResults(results) {
    results.forEach(book => {
      book.dateAdded = +book._id.getTimestamp();
      if (/\d{4}-\d{2}-\d{2}/.test(book.publicationDate)) {
        book.publicationDate = moment(book.publicationDate).format("MMMM Do YYYY");
      }
      if (/http:\/\/my-library-cover-uploads/.test(book.smallImage)) {
        book.smallImage =
          "https://s3.amazonaws.com/my-library-cover-uploads/" +
          book.smallImage.replace(/http:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com\//, "");
      }
    });
  }
}
