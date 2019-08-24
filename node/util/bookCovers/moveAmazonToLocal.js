import request from "request";
import uuid from "uuid/v4";
import Jimp from "jimp";
import dlv from "dlv";
import { getDbConnection } from "../dbUtils";
import { getGraphqlSchema } from "../graphqlUtils";
import { downloadBookCover, removeFile, resizeIfNeeded, saveCoverToS3, getOpenLibraryCoverUri, getGoogleLibraryUri } from "./bookCoverHelpers";

import { ObjectId } from "mongodb";

const { graphql } = require("graphql");

const dbPromise = getDbConnection();

let count = 1;

async function updateBookCovers(field, maxWidth) {
  const { db, client } = await dbPromise;
  const { root, executableSchema } = getGraphqlSchema(dbPromise);

  let res = await (db.collection("books").find({ [field]: RegExp(/amazon\.com/) }).toArray());

  for (let book of res) {
    let { _id, isbn, title } = book;

    let res = await downloadBookCover(book[field], 1000);
    if (!res) {
      console.log("Oops download failed for small image for", title);
    } else {
      let { fileName, fullName } = res;
      let newPath = await resizeIfNeeded(fileName, maxWidth);

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
}

(async function() {
  try {
    console.log("Starting...\n");
    await updateBookCovers("smallImage");
    console.log("XXX")
    await updateBookCovers("mediumImage", 106);

    const { db, client } = await dbPromise;
    client.close();

  } catch (err) {
    console.log("Error caught at the top level: ", err);
  }
})();
