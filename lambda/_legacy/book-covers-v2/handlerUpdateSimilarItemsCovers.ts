import fetch from "node-fetch";
import dlv from "dlv";

import { ObjectId } from "mongodb";

import getDbConnection from "../util/getDbConnection";

import { saveContentToS3, getOpenLibraryCoverUri, getGoogleLibraryUri } from "../../util/bookCoverHelpers";

import { getSecrets } from "../../util/getSecrets";
import { HandleCoverResult } from "../../util/handleCover";
import { attemptSimilarBookCover } from "../../util/similarBookHelpers";

const dbPromise = getDbConnection();

const delay = () => new Promise(res => setTimeout(res, 2500));

async function updateBookSummaryCovers() {
  const log = (...args) => {
    console.log(...args);
    _logs.push(args.join(" "));
  };
  let _logs = [];

  let count = 1;
  const db = await dbPromise;
  const secrets = await getSecrets();
  const isbnDbKey = secrets["isbn-db-key"];

  const bookSummaries = await db
    .collection("bookSummaries")
    .aggregate([{ $match: { smallImage: new RegExp("nophoto") } }, { $limit: 15 }])
    .toArray();

  log("Books found:", bookSummaries.length);

  for (let bookSummary of bookSummaries) {
    let { _id, isbn, title } = bookSummary;
    log("Starting:", title);

    await delay();

    let res: HandleCoverResult;

    try {
      const fetchResponse = await fetch(`https://api2.isbndb.com/book/${isbn}`, {
        headers: {
          Authorization: isbnDbKey
        }
      });
      const bookResult: any = await fetchResponse.json();

      console.log("Found on isbndb");

      if (bookResult && bookResult.book && bookResult.book.image) {
        let imageUrl = bookResult.book.image;
        if (imageUrl) {
          res = await attemptSimilarBookCover(imageUrl, 500);
          if (res?.STATUS === "success") {
            console.log("Downloaded cover from isbndb");
          }
        }
      }
    } catch (err) {}

    if (res?.STATUS !== "success") {
      res = await attemptSimilarBookCover(getOpenLibraryCoverUri(isbn), 1000);
      if (res?.STATUS !== "success") {
        log("No cover found on OpenLibrary for", title);

        log("Trying Google...");

        let cover = await getGoogleCoverUrl(isbn, secrets);
        if (!cover) {
          log(`Cover not found on Google either for ${title}`);
          await db.collection("bookSummaries").updateOne(
            { _id: new ObjectId(_id) },
            {
              $set: { smallImage: "", smallImagePreview: "" }
            }
          );

          continue;
        }

        log("Attempting Google cover", cover);

        res = await attemptSimilarBookCover(cover, 1000);

        if (res?.STATUS !== "success") {
          log(`Could not download from Google, either`);

          await db.collection("bookSummaries").updateOne(
            { _id: new ObjectId(_id) },
            {
              $set: { smallImage: "", smallImagePreview: "" }
            }
          );

          continue;
        }
      }
    }

    if (res.STATUS === "success") {
      const { url, preview } = res.image;

      log("#", count++, title, url);
      await db.collection("bookSummaries").updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: { smallImage: url, smallImagePreview: preview }
        }
      );
    }
  }

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;

  console.log("Saving logs to", `bookCoverSyncingLogs/${dateStr}.txt`);
  await saveContentToS3(_logs.join("\n"), `bookCoverSyncingLogs/${dateStr}.txt`);
  console.log("Logs saved");
}

function getGoogleCoverUrl(isbn, secrets): Promise<string> {
  return new Promise(async resolve => {
    try {
      let response: any = await fetch(getGoogleLibraryUri(isbn, secrets["google-library-key"]));
      if (!response.ok) {
        console.log("Error:", response.statusCode);
        return resolve(null);
      }

      let json = await response.json();
      let items = json.items;

      if (!Array.isArray(items) || !items.length || !items[0]) {
        return resolve(null);
      }

      let imageLinks = dlv(items[0], "volumeInfo.imageLinks");
      if (!imageLinks) {
        return resolve(null);
      }

      let smallImage = imageLinks.smallThumbnail || imageLinks.thumbnail;
      if (smallImage) {
        smallImage = smallImage.replace(/&edge=curl/gi, "");
      }

      return resolve(smallImage || null);
    } catch (err) {
      console.log("Error fetching and processing", err);
      return resolve(null);
    }
  });
}

export const handler = async event => {
  await updateBookSummaryCovers();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Done!" })
  };
};
