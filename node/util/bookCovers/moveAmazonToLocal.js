import request from "request";
import uuid from "uuid/v4";
import Jimp from "jimp";
import dlv from "dlv";
import { getDbConnection } from "../dbUtils";
import { getGraphqlSchema } from "../graphqlUtils";
import BookSummariesWithBadCovers from "../../graphql-queries/bookSummariesWithBadCovers";
import { downloadBookCover, removeFile, resizeIfNeeded, saveCoverToS3, getOpenLibraryCoverUri, getGoogleLibraryUri } from "./bookCoverHelpers";

import { ObjectId } from "mongodb";
const { graphql } = require("graphql");

const dbPromise = getDbConnection();

const delay = () => new Promise(res => setTimeout(res, 200));
let count = 1;

async function updateBookCovers(query, field) {
  const { db, client } = await dbPromise;
  const { root, executableSchema } = getGraphqlSchema(dbPromise);
  let resp = await graphql(executableSchema, query, root, {}, { pageSize: 500 });

  let title = "";

  for (let book of resp.data.allBooks.Books) {
    let { _id, isbn, title } = book;

    await delay();
    let res = await downloadBookCover(book[field], 1000);
    if (!res) {
      console.log("Oops download failed for small image for", title);
    } else {
      let { fileName, fullName } = res;
      let newPath = await resizeIfNeeded(fileName);

      if (newPath) {  
        let s3Key = await saveCoverToS3(newPath, `bookCovers/${book.userId}/${fileName}`);

        console.log("#", count++, title, s3Key, "\n");
        await db.collection("books").updateOne(
          { _id: ObjectId(_id) },
          {
            $set: { [field]: s3Key }
          }
        );
      }

      removeFile(fullName);
      newPath && removeFile(newPath);
    }
  }

  client.close();
}

(async function() {
  try {
    console.log("Starting...\n");
    await updateBookCovers();
  } catch (err) {
    console.log("Error caught at the top level: ", err);
  }
})();
