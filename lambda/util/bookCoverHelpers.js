const AWS = require("aws-sdk");
AWS.config.region = "us-east-1";

const path = require("path");
const request = require("request");
const { v4: uuid } = require("uuid");
const del = require("del");
const fs = require("fs");

const Jimp = require("jimp");

const GOOGLE_LIBRARY_KEY = process.env.GOOGLE_LIBRARY_KEY;

const getOpenLibraryCoverUri = isbn => `http://covers.openlibrary.org/b/ISBN/${isbn}-M.jpg`;
const getGoogleLibraryUri = (isbn, GOOGLE_LIBRARY_KEY) => `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_LIBRARY_KEY}`;

exports.getOpenLibraryCoverUri = getOpenLibraryCoverUri;
exports.getGoogleLibraryUri = getGoogleLibraryUri;

module.exports.downloadBookCover = downloadBookCover;
function downloadBookCover(url, minSizeToAccept) {
  let ext = path.extname(url) || ".jpg";

  let uniqueId = uuid();
  let fileName = "file-" + uniqueId + ext;
  let fullName = path.resolve("/tmp/" + fileName);

  return new Promise(res => {
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

module.exports.resizeIfNeeded = resizeIfNeeded;
function resizeIfNeeded(fileName, width = 50) {
  let pathToFileUploaded = path.resolve("/tmp/" + fileName);
  let resizedDestination = path.resolve("/tmp/" + "resized_" + fileName);
  return new Promise(res => {
    try {
      Jimp.read(pathToFileUploaded, function (err, image) {
        if (err || !image) {
          return res(null);
        }

        try {
          image.exifRotate();
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
          return res(null);
        }
      });
    } catch (err) {
      return res(null);
    }
  });
}

module.exports.removeFile = removeFile;
function removeFile(fullName) {
  try {
    del.sync(fullName);
  } catch (er) {}
}

module.exports.saveCoverToS3 = saveCoverToS3;
function saveCoverToS3(source, s3Key) {
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

      s3bucket.upload(params, function (err) {
        if (err) res(err);
        else res(`https://my-library-cover-uploads.s3.amazonaws.com/${params.Key}`);
      });
    });
  });
}

module.exports.saveContentToS3 = saveContentToS3;
function saveContentToS3(content, s3Key) {
  return new Promise(res => {
    let s3bucket = new AWS.S3({ params: { Bucket: "my-library-cover-uploads" } });

    let params = {
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
