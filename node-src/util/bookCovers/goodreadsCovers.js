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
import dlv from "dlv";

import { downloadBookCover, removeFile, resizeIfNeeded, saveCoverToS3, getOpenLibraryCoverUri, getGoogleLibraryUri } from "./bookCoverHelpers";

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

  let title = "";
  let testIsbns = ["081664733X", "0801878918", "0525951040", "0199596654"];

  for (let bookSummary of resp.data.allBookSummarys.BookSummarys) {
    let db = await mongoDbPromise;
    let { _id, isbn, title } = bookSummary;

    await delay();
    let res = await downloadBookCover(getOpenLibraryCoverUri(isbn), 1000);
    if (!res) {
      console.log("No cover found on OpenLibrary for", title);

      console.log("\nTrying Google...\n");

      let cover = await getGoogleCoverUrl(isbn);
      res = await downloadBookCover(cover, 1000);

      if (!res) {
        console.log(`${title} not found on Google, either`);

        continue;
      }
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

function getGoogleCoverUrl(isbn) {
  return new Promise(res => {
    request(getGoogleLibraryUri(isbn), (err, resp, body) => {
      if (err || !/^2/.test(resp.statusCode)) return res(null);

      try {
        let item = JSON.parse(body).items[0];
        let imageLinks = dlv(item, "volumeInfo.imageLinks");
        let smallImage = imageLinks.smallThumbnail || imageLinks.thumbnail;
        if (smallImage) {
          smallImage = smallImage.replace(/&edge=curl/gi, "");
        }

        return res(smallImage || null);
      } catch (er) {
        res(null);
      }
    });
  });
}

(async function() {
  try {
    console.log("Starting...\n");
    await updateBookSummaryCovers();
  } catch (err) {
    console.log("Error caught at the top level: ", err);
  }
})();
