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

import { downloadBookCover, removeFile, resizeIfNeeded, saveCoverToS3, getOpenLibraryCoverUri } from "./bookCoverHelpers";

const { graphql } = require("graphql");

const IS_DEV = process.env.IS_DEV;

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
  let resp = await graphql(executableSchema, BookSummariesWithBadCovers, root, {}, { pageSize: 500 });

  let testIsbns = ["038549517X", "1560258489", "0674002350", "0393327795", "0199205647", "0807010030", "9781594204876", "019514970X"];

  for (let bookSummary of resp.data.allBookSummarys.BookSummarys) {
    let db = await mongoDbPromise;
    let { _id, isbn, title } = bookSummary;

    await delay();
    let res = await downloadBookCover(getOpenLibraryCoverUri(isbn), 1000); // < 1200 bytes on a medium
    if (!res) {
      continue;
    }

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
  }
  mongoClientPromise
    .then(client => {
      client.close();
    })
    .catch(err => {});
}

(async function() {
  try {
    console.log("Starting...\n");
    await updateBookSummaryCovers();
  } catch (err) {
    console.log("Error caught at the top level: ", err);
  }
})();
