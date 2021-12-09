import S3 from "aws-sdk/clients/s3";

import path from "path";
import https from "https";
import http from "http";
import fs from "fs";

import del from "del";
import { v4 as uuid } from "uuid";

import Jimp from "jimp";

export const getOpenLibraryCoverUri = isbn => `http://covers.openlibrary.org/b/ISBN/${isbn}-M.jpg`;
export const getGoogleLibraryUri = (isbn, GOOGLE_LIBRARY_KEY) =>
  `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_LIBRARY_KEY}`;

export function downloadBookCover(url, minSizeToAccept) {
  let ext = path.extname(url) || ".jpg";

  let uniqueId = uuid();
  let fileName = "file-" + uniqueId + ext;
  let fullName = path.resolve("/tmp/" + fileName);
  let network = /^https/.test(url) ? https : http;

  return new Promise<any>(res => {
    let file = fs.createWriteStream(fullName);

    network
      .get(url, response => {
        response.pipe(file);
        file.on("finish", async () => {
          await file.close();

          let stats = fs.statSync(fullName);
          let fileSizeInBytes = stats.size;

          if (fileSizeInBytes < minSizeToAccept) {
            removeFile(fullName);
            return res(null);
          }

          fs.readFile(fullName, (err, data) => {
            if (err) {
              removeFile(fullName);
              return res(null);
            }
            console.log("File saved to", fullName);
            res({ fullName, fileName });
          });
        });

        file.on("error", async err => {
          console.log("File error", err);
          removeFile(fullName);
          res(null);
        });
      })
      .on("error", err => {
        console.log("Request error", err);
        removeFile(fullName);
        res(null);
      });
  });
}

export function resizeIfNeeded(fileName, width = 50) {
  let pathToFileUploaded = path.resolve("/tmp/" + fileName);
  let resizedDestination = path.resolve("/tmp/" + "resized_" + fileName);
  return new Promise(res => {
    try {
      Jimp.read(pathToFileUploaded, function (err, image: any) {
        if (err || !image) {
          console.log("Error 1", err);
          return res(null);
        }

        try {
          image.exifRotate && image.exifRotate();
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
        } catch (err) {
          console.log("Error 2", err);
          return res(null);
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
    let s3bucket = new S3({ params: { Bucket: "my-library-cover-uploads" } });

    fs.readFile(source, (err, data) => {
      if (err) {
        return res(null);
      }
      let params = {
        Key: s3Key,
        Body: data
      } as any;

      s3bucket.upload(params, function (err) {
        if (err) res(err);
        else res(`https://my-library-cover-uploads.s3.amazonaws.com/${params.Key}`);
      });
    });
  });
}

export function saveContentToS3(content, s3Key) {
  return new Promise(res => {
    let s3bucket = new S3({ params: { Bucket: "my-library-cover-uploads" } });

    let params: any = {
      Key: s3Key,
      Body: content
    };

    s3bucket.upload(params, function (err) {
      if (err) {
        console.log("Error uploading to S3", { s3Key, err });
        res(err);
      } else {
        console.log("S3 File Saved");
        res(`https://my-library-cover-uploads.s3.amazonaws.com/${params.Key}`);
      }
    });
  });
}
