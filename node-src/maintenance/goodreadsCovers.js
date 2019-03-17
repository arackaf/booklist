import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

import request from "request";
import uuid from "uuid/v4";
import del from "del";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import { MongoClient } from "mongodb";

import { makeExecutableSchema } from "graphql-tools";
import resolvers from "../graphQL/resolver";
import schema from "../graphQL/schema";

const { graphql } = require("graphql");

const IS_DEV = process.env.IS_DEV;

const connString = process.env.IS_PUBLIC ? process.env.MONGO_PUBLIC : process.env.MONGO_CONNECTION;
const dbName = process.env.IS_PUBLIC ? process.env.DB_NAME_PUBLIC : process.env.DB_NAME;

const mongoClientPromise = MongoClient.connect(connString, { useNewUrlParser: true });
const mongoDbPromise = mongoClientPromise.then(client => client.db(dbName));

const root = { client: IS_DEV ? null : mongoClientPromise, db: mongoDbPromise };
const executableSchema = makeExecutableSchema({ typeDefs: schema, resolvers });

import BookSummariesWithBadCovers from "../graphql-queries/bookSummariesWithBadCovers";

export async function updateBookSummaryCovers(howMany) {
  let resp = await graphql(executableSchema, BookSummariesWithBadCovers, root, {}, { pageSize: howMany });

  for (let bookSummary of resp.data.allBookSummarys.BookSummarys) {
    console.log(bookSummary);
  }
}

function saveImageToS3(url, userId) {
  return new Promise((res, rej) => {
    let s3bucket = new AWS.S3({ params: { Bucket: "my-library-cover-uploads" } });
    let ext = path.extname(url);
    let uniqueId = uuid();
    let fileName = "file-" + uniqueId + ext;
    let fullName = path.resolve("./conversions/" + fileName);
    mkdirp.sync(path.resolve("./conversions"));
    let file = fs.createWriteStream(fullName);

    request(url)
      .pipe(file)
      .on("finish", () => {
        file.close();

        fs.readFile(fullName, (err, data) => {
          if (err) {
            return rej(err);
          }
          let params = {
            Key: `bookCovers/${userId || "generic"}/gr-converted-cover-${uniqueId}${ext}`,
            Body: data
          };

          s3bucket.upload(params, function(err) {
            try {
              del.sync(fullName);
            } catch (e) {}

            if (err) rej(err);
            else res(`http://my-library-cover-uploads.s3-website-us-east-1.amazonaws.com/${params.Key}`);
          });
        });
      })
      .on("error", () => rej());
  });
}

(async function() {
  updateBookSummaryCovers(5);
})();
