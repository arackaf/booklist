import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

import request from "request";
import uuid from "uuid/v4";
import del from "del";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";

const awsCredentials = {
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  assocId: process.env.ASSOC_ID
};

if (!process.env.IS_PUBLIC) {
  var OperationHelper = require("apac").OperationHelper;
  var opHelper = new OperationHelper(awsCredentials);
}

export default class AmazonSearch {
  lookupBook(isbn) {
    return new Promise(function(resolve, reject) {
      if (!isbn) {
        return resolve([]);
      }
      opHelper
        .execute("SimilarityLookup", {
          SearchIndex: "Books",
          IdType: "ISBN",
          ResponseGroup: "ItemAttributes,Images",
          ItemId: isbn
        })
        .then(async ({ result }) => {
          if (!result.SimilarityLookupResponse || !result.SimilarityLookupResponse.Items || !result.SimilarityLookupResponse.Items.Item) {
            return resolve([]);
          } else {
            let itemsArray = result.SimilarityLookupResponse.Items.Item;
            if (Array.isArray(itemsArray)) {
              let resultsP = itemsArray.map(item => projectResponse(item)).filter(item => item);
              let results = [];
              for (let p of resultsP) {
                results.push(await p);
              }
              resolve(results);
            } else {
              resolve([projectResponse(item)].filter(item => item));
            }
          }
        })
        .catch(err => {
          resolve([]);
        });
    });
  }
}

async function projectResponse(item) {
  let attributes = item.ItemAttributes;
  let result = {
    title: safeAccess(attributes, "Title"),
    asin: safeAccess(item, "ASIN"),
    isbn: safeAccess(attributes, "ISBN"),
    ean: safeAccess(attributes, "EAN"),
    smallImage: safeAccess(safeAccessObject(item, "SmallImage"), "URL"),
    mediumImage: safeAccess(safeAccessObject(item, "MediumImage"), "URL"),
    authors: safeArray(attributes, attributes => attributes.Author)
  };

  if (/^http:\/\//.test(result.smallImage)) {
    try {
      let newImage = await saveImageToS3(result.smallImage, ean);
      result.smallImage = newImage;
    } catch (e) {}
  }

  return result;

  function safeArray(item, lambda) {
    try {
      let val = lambda(item);
      if (!val) {
        return [];
      } else if (Array.isArray(val)) {
        return val;
      } else {
        return [val];
      }
    } catch (err) {
      return [];
    }
  }

  function safeAccess(obj, path) {
    return obj[path] || "";
  }

  function safeAccessObject(obj, path) {
    return obj[path] || {};
  }
}

export function saveImageToS3(url, ean) {
  return new Promise((res, rej) => {
    let s3bucket = new AWS.S3({ params: { Bucket: "my-library-cover-uploads" } });
    let ext = path.extname(url);
    let uniqueId = uuid();
    let fileName = "file-" + uniqueId + ext;
    let fullName = path.resolve("./conversions/" + fileName);
    mkdirp.sync(path.resolve("./conversions"));
    let file = fs.createWriteStream(fullName);

    request(url)
      .pipe(file)
      .on("finish", () => {
        file.close();

        fs.readFile(fullName, (err, data) => {
          if (err) {
            return rej(err);
          }
          let params = {
            Key: `bookCovers/${ean}/converted-similar-cover-${uniqueId}${ext}`,
            Body: data
          };

          s3bucket.upload(params, function(err) {
            try {
              del.sync(fullName);
            } catch (e) {}

            if (err) rej(err);
            else res(`http://my-library-cover-uploads.s3-website-us-east-1.amazonaws.com/${params.Key}`);
          });
        });
      })
      .on("error", () => rej());
  });
}
