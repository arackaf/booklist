import moment from "moment";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

export default class BooksMiddleware {
  adjustResults(results) {
    results.forEach(book => {
      if (/https?:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com/.test(book.smallImage)) {
        book.smallImage =
          "https://my-library-cover-uploads.s3.amazonaws.com/" +
          book.smallImage.replace(/https?:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com\//, "");
      }
      if (/https?:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com/.test(book.mediumImage)) {
        book.mediumImage =
          "https://my-library-cover-uploads.s3.amazonaws.com/" +
          book.mediumImage.replace(/https?:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com\//, "");
      }
    });
  }
}
