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

const delay = () => new Promise(res => setTimeout(res, 2500));
let count = 1;

export async function updateBookSummaryCovers() {
  const { db, client } = await dbPromise;
  const { root, executableSchema } = getGraphqlSchema(dbPromise);
  let resp = await graphql(executableSchema, BookSummariesWithBadCovers, root, {}, { pageSize: 500 });

  let title = "";
  let testIsbns = ["081664733X", "0801878918", "0525951040", "0199596654"];

  for (let bookSummary of resp.data.allBookSummarys.BookSummarys) {
    let { _id, isbn, title } = bookSummary;

    await delay();
    let res = await downloadBookCover(getOpenLibraryCoverUri(isbn), 1000);
    if (!res) {
      console.log("No cover found on OpenLibrary for", title);

      console.log("\nTrying Google...\n");

      let cover = await getGoogleCoverUrl(isbn);
      if (!cover) {
        continue;
      }
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

  client.close();
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
