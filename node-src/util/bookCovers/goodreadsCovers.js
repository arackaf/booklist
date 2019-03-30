import request from "request";
import uuid from "uuid/v4";
import del from "del";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import { MongoClient, ObjectId } from "mongodb";

import { makeExecutableSchema } from "graphql-tools";
import resolvers from "../../graphQL/resolver";
import schema from "../../graphQL/schema";
import Jimp from "jimp";

import { downloadBookCover, removeFile, resizeIfNeeded, saveCoverToS3 } from "./bookCoverHelpers";

const { graphql } = require("graphql");

const IS_DEV = process.env.IS_DEV;

const LT_THING_KEY = process.env.LIBRARY_THING_KEY;

const connString = process.env.IS_PUBLIC ? process.env.MONGO_PUBLIC : process.env.MONGO_CONNECTION;

const dbName = process.env.IS_PUBLIC ? process.env.DB_NAME_PUBLIC : process.env.DB_NAME;

const mongoClientPromise = MongoClient.connect(connString, { useNewUrlParser: true });
const mongoDbPromise = mongoClientPromise.then(client => client.db(dbName));

const root = { client: IS_DEV ? null : mongoClientPromise, db: mongoDbPromise };
const executableSchema = makeExecutableSchema({ typeDefs: schema, resolvers });

import BookSummariesWithBadCovers from "../../graphql-queries/bookSummariesWithBadCovers";

const delay = () => new Promise(res => setTimeout(res, 2500));
let count = 1;

export async function updateBookSummaryCovers() {
  let resp = await graphql(executableSchema, BookSummariesWithBadCovers, root, {}, {});
  let getOpenLibraryCoverUri = isbn => `http://covers.openlibrary.org/b/ISBN/${isbn}-M.jpg`;

  for (let bookSummary of resp.data.allBookSummarys.BookSummarys) {
    let db = await mongoDbPromise;
    let { _id, isbn, title } = bookSummary;

    let res = await downloadBookCover(getOpenLibraryCoverUri(isbn));
    if (!res) continue;

    let { fileName, fullName } = res;
    let newPath = await resizeIfNeeded(fileName);

    if (newPath) {
      let s3Key = await saveCoverToS3(newPath, `bookCovers/bookSummary/${fileName}`);

      console.log("#", count++, title, s3Key, "\n");
      await db.collection("bookSummaries").updateOne(
        { _id: ObjectId(_id) },
        {
          $set: { smallImage: s3Key }
        }
      );
    }

    removeFile(fullName);
    newPath && removeFile(newPath);
    await delay();
  }
  mongoClientPromise
    .then(client => {
      client.close();
    })
    .catch(err => {});
}

(async function() {
  updateBookSummaryCovers();
})();
