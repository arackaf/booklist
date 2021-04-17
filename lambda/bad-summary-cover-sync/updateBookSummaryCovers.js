"use strict";

const request = require("request");
const { v4: uuid } = require("uuid");
const dlv = require("dlv").default;

const { ObjectId } = require("mongodb");
const moment = require("moment");

const getDbConnection = require("../util/getDbConnection");

const {
  downloadBookCover,
  removeFile,
  resizeIfNeeded,
  saveCoverToS3,
  saveContentToS3,
  getOpenLibraryCoverUri,
  getGoogleLibraryUri
} = require("../util/bookCoverHelpers");

const getSecrets = require("../util/getSecrets");

const dbPromise = getDbConnection();

const delay = () => new Promise(res => setTimeout(res, 2500));

module.exports = async function updateBookSummaryCovers() {
  let count = 1;
  const db = await dbPromise;
  const secrets = await getSecrets();

  const bookSummaries = await db
    .collection("bookSummaries")
    .aggregate([{ $match: { smallImage: new RegExp("nophoto") } }, { $limit: 15 }])
    .toArray();

  let title = "";

  let _logs = [];
  const log = (...args) => {
    console.log(...args);
    _logs.push(args.join(" "));
  };

  for (let bookSummary of bookSummaries) {
    let { _id, isbn, title } = bookSummary;

    await delay();
    let res = await downloadBookCover(getOpenLibraryCoverUri(isbn), 1000);
    if (!res) {
      log("No cover found on OpenLibrary for", title);

      log("Trying Google...");

      let cover = await getGoogleCoverUrl(isbn, secrets);
      if (!cover) {
        log(`Cover not found on Google either for ${title}`);
        continue;
      }

      log("Attempting Google cover", cover);

      res = await downloadBookCover(cover, 1000);

      if (!res) {
        log(`Could not download from Google, either`);

        continue;
      }
    }

    let { fileName, fullName } = res;
    let newPath = await resizeIfNeeded(fileName);

    if (newPath) {
      let s3Key = await saveCoverToS3(newPath, `bookCovers/bookSummary/${fileName}`);

      log("#", count++, title, s3Key);
      await db.collection("bookSummaries").updateOne(
        { _id: ObjectId(_id) },
        {
          $set: { smallImage: s3Key }
        }
      );
    } else {
      log(`Google cover failed`);
    }

    removeFile(fullName);
    newPath && removeFile(newPath);
  }

  saveContentToS3(_logs.join("\n"), `bookCoverSyncingLogs/${moment().format("YYYY-MM-DD--HH_mm")}.txt`);
};

function getGoogleCoverUrl(isbn, secrets) {
  return new Promise(res => {
    request(getGoogleLibraryUri(isbn, secrets["google-library-key"]), (err, resp, body) => {
      if (err || !/^2/.test(resp.statusCode)) {
        console.log("Error:", err, resp.statusCode);
        return res(null);
      }

      try {
        let items = JSON.parse(body).items;

        if (!Array.isArray(items) || !items.length || !items[0]) {
          return res(null);
        }

        let imageLinks = dlv(items[0], "volumeInfo.imageLinks");
        if (!imageLinks) {
          return res(null);
        }

        let smallImage = imageLinks.smallThumbnail || imageLinks.thumbnail;
        if (smallImage) {
          smallImage = smallImage.replace(/&edge=curl/gi, "");
        }

        return res(smallImage || null);
      } catch (er) {
        console.log("processing error", er);
        console.log("body", body);
        res(null);
      }
    });
  });
}
