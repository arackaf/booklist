import moment from "moment";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

export default class BooksMiddleware {
  adjustResults(results) {
    results.forEach(book => {
      if (/http:\/\/my-library-cover-uploads/.test(book.smallImage)) {
        book.smallImage =
          "https://s3.amazonaws.com/my-library-cover-uploads/" +
          book.smallImage.replace(/http:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com\//, "");
      }
      if (/http:\/\/my-library-cover-uploads/.test(book.mediumImage)) {
        book.mediumImage =
          "https://s3.amazonaws.com/my-library-cover-uploads/" +
          book.mediumImage.replace(/http:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com\//, "");
      }
    });
  }
}
