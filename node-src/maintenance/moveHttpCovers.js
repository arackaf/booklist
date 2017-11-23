import AWS from "aws-sdk";

AWS.config.region = "us-east-1";

import fs from "fs";
import path from "path";
import http from "http";
import DAO from "../dataAccess/dao";

let dao = new DAO();

async function convertAll() {
  let db = await dao.open();
  let toConvert = await db
    .collection("books")
    .find({ smallImage: { $regex: /http:\/\/ecx/ } })
    .toArray();

  toConvert.forEach(book => console.log(book.smallImage));
}

//convertAll();

/*
convertFile("http://ecx.images-amazon.com/images/I/513GMmespwL._SL75_.jpg", "1123", "556")
  .then(path => console.log("SUCCEED", path))
  .catch(err => console.log("ERR", err));
*/

function convertFile(url, userId, _id) {
  return new Promise((res, rej) => {
    http.get(url, response => {
      try {
        let s3bucket = new AWS.S3({ params: { Bucket: "my-library-cover-uploads" } });
        let ext = path.extname(url);
        let fileName = "junk" + ext;

        let file = fs.createWriteStream(fileName);
        response.pipe(file);

        fs.readFile("./" + fileName, (err, data) => {
          if (err) {
            return rej(err);
          }
          let params = {
            Key: `bookCovers/${userId}/converted-cover-${_id}${ext}`,
            Body: data
          };

          s3bucket.upload(params, function(err) {
            if (err) rej(err);
            else res(`http://my-library-cover-uploads.s3-website-us-east-1.amazonaws.com/${params.Key}`);
          });
        });
      } catch (err) {
        rej(err);
      }
    });
  });
}
