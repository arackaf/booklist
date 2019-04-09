import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

import path from "path";
import request from "request";
import uuid from "uuid/v4";
import del from "del";
import fs from "fs";
import mkdirp from "mkdirp";

import Jimp from "jimp";

const GOOGLE_LIBRARY_KEY = process.env.GOOGLE_LIBRARY_KEY;

export const getOpenLibraryCoverUri = isbn => `http://covers.openlibrary.org/b/ISBN/${isbn}-M.jpg`;
export const getGoogleLibraryUri = isbn => `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_LIBRARY_KEY}`;

export function downloadBookCover(url, minSizeToAccept) {
  let ext = path.extname(url) || ".jpg";

  let uniqueId = uuid();
  let fileName = "file-" + uniqueId + ext;
  let fullName = path.resolve("./conversions/" + fileName);

  return new Promise(res => {
    mkdirp.sync(path.resolve("./conversions"));
    let file = fs.createWriteStream(fullName);

    request(url)
      .pipe(file)
      .on("finish", () => {
        file.close();

        let stats = fs.statSync(fullName);
        let fileSizeInBytes = stats.size;

        if (fileSizeInBytes < minSizeToAccept) {
          removeFile(fullName);
          res(null);
        }

        fs.readFile(fullName, (err, data) => {
          if (err) {
            removeFile(fullName);

            return res(null);
          }
          res({ fullName, fileName });
        });
      })
      .on("error", () => {
        removeFile(fullName);

        res(null);
      });
  });
}

export function resizeIfNeeded(fileName, width = 50) {
  let pathToFileUploaded = path.resolve("./conversions/" + fileName);
  let resizedDestination = path.resolve("./conversions/" + "resized_" + fileName);

  return new Promise(res => {
    try {
      Jimp.read(pathToFileUploaded, function(err, image) {
        if (err) {
          return res(null);
        }

        if (image.bitmap.width > width) {
          image.resize(width, Jimp.AUTO);

          image.write(resizedDestination, err => {
            if (err) {
              return res(null);
            }
            res(resizedDestination);
          });
        } else {
          return res(pathToFileUploaded);
        }
      });
    } catch (err) {
      return res(null);
    }
  });
}

export function removeFile(fullName) {
  try {
    del.sync(fullName);
  } catch (er) {}
}

export function saveCoverToS3(source, s3Key) {
  return new Promise(res => {
    let s3bucket = new AWS.S3({ params: { Bucket: "my-library-cover-uploads" } });

    fs.readFile(source, (err, data) => {
      if (err) {
        return res(null);
      }
      let params = {
        Key: s3Key,
        Body: data
      };

      s3bucket.upload(params, function(err) {
        if (err) res(err);
        else res(`http://my-library-cover-uploads.s3-website-us-east-1.amazonaws.com/${params.Key}`);
      });
    });
  });
}
