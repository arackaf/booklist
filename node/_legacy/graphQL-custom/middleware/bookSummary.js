import moment from "moment";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

export default class BooksMiddleware {
  async beforeUpdate(match, updates, { root, args, context, ast }) {
    return !!context.user.admin;
  }
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
  queryMiddleware(queryPacket, { root, args, context, ast }) {
    let { aggregationPipeline } = queryPacket;

    if (!context.user.admin && (queryPacket.$limit == null || queryPacket.$limit > 50)) {
      queryPacket.$limit = 50;
      if (!aggregationPipeline.find(packet => packet.hasOwnProperty("$limit"))) {
        aggregationPipeline.push({ $limit: queryPacket.$limit });
      }
    }
  }
}
