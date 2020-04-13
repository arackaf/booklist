"use strict";

const AWS = require("aws-sdk");
const { S3 } = AWS;

const Jimp = require("jimp").default;

module.exports.uploadCover = async event => {
  const s3 = new S3({});
  return new Promise(res => {
    var sourceParams = { Bucket: "my-library-cover-upload-staging", Key: "big-image.jpg" };
    s3.getObject(sourceParams, (err, data) => {
      if (err) {
        return res(err);
      }
      const originalImg = data.Body; //.toString('base64');

      Jimp.read(originalImg, function(err, image) {
        if (err || !image) {
          return res(err);
        }

        try {
          if (image.bitmap.width > 100) {
            image.resize(100, Jimp.AUTO);

            image.getBuffer(image.getMIME(), (err, body) => {
              if (err) {
                return res(err);
              }
              var params = { Bucket: "my-library-cover-upload-staging", Key: "resized-YEAH.jpg", Body: body };

              s3.upload(params, function(err, data) {
                res(err || "Success!!! \O/ ");
              });
            });
          } else {
            return res("No upload");
          }
        } catch (err) {
          return res(null);
        }
      });
    });
  });
};
