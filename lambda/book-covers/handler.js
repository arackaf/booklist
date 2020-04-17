"use strict";

const AWS = require("aws-sdk");
const { S3 } = AWS;

const Jimp = require("jimp").default;
const awsMultiPartParser = require("lambda-multipart-parser");

const CorsResponse = obj => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
  },
  body: JSON.stringify(obj)
});

module.exports.uploadCover = async (event, context, c) => {
  const s3 = new S3({});

  const body = event.body;
  const busBoyResults = await awsMultiPartParser.parse(event);
  const MAX_WIDTH = 50;

  return new Promise(res => {
    try {
      Jimp.read(busBoyResults.files[0].content, function(err, image) {
        if (err || !image) {
          return res(CorsResponse({ error: true, message: err }));
        }

        try {
          if (image.bitmap.width > MAX_WIDTH) {
            image.resize(MAX_WIDTH, Jimp.AUTO);

            image.getBuffer(image.getMIME(), (err, body) => {
              if (err) {
                return res(CorsResponse({ error: true, message: err }));
              }

              var params = { Bucket: "my-library-cover-uploads", Key: "temp/Yoooo-resized-YEAH-HAPPY.jpg", Body: body };
              s3.upload(params, function(err, data) {
                if (err) {
                  return res(CorsResponse({ error: true, message: err }));
                }
                res(CorsResponse({ success: true, url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` }));
              });
            });
          } else {
            image.getBuffer(image.getMIME(), (err, body) => {
              if (err) {
                return res(CorsResponse({ error: true, message: err }));
              }

              var params = { Bucket: "my-library-cover-uploads", Key: "temp/Yoooo-NOT-resized-BUT-STILL-HAPPY.jpg", Body: body };
              s3.upload(params, function(err, data) {
                if (err) {
                  return res(CorsResponse({ error: true, message: err }));
                }
                res(CorsResponse({ success: true, url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` }));
              });
            });
          }
        } catch (err) {
          return res(CorsResponse({ error: true, message: "No file" }));
        }
      });
    } catch (err) {
      res(CorsResponse({ error: true, message: err }));
    }
  });
};
