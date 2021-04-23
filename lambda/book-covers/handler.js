const path = require("path");
const uuid = require("uuid/v4");
const request = require("request");
const awsMultiPartParser = require("lambda-multipart-parser");

const checkLogin = require("../util/checkLoginToken");
const resizeImage = require("../util/resizeImage");
const corsResponse = require("../util/corsResponse");
const uploadToS3 = require("../util/uploadToS3");
const downloadFromUrl = require("../util/downloadFromUrl");
const getSecrets = require("../util/getSecrets");

module.exports.upload = async event => {
  const formPayload = await awsMultiPartParser.parse(event);
  const { userId, loginToken, size } = formPayload;
  const file = formPayload.files[0];
  const MAX_WIDTH = size == "small" ? 50 : size == "medium" ? 106 : 200;

  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({});
  }

  const imageResult = await resizeImage(file.content, MAX_WIDTH);

  if (imageResult.error || !imageResult.body) {
    return corsResponse({ error: true });
  }
  const newName = `bookCovers/${userId}/${uuid()}${path.extname(file.filename) || ".jpg"}`;
  const s3Result = await uploadToS3(newName, imageResult.body);
  return corsResponse(s3Result);
};

module.exports.uploadFromUrl = async event => {
  const { userId, loginToken, size, url } = JSON.parse(event.body);
  const MAX_WIDTH = size == "small" ? 50 : size == "medium" ? 106 : 200;

  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({});
  }
  const { body, error } = await downloadFromUrl(url);

  const imageResult = await resizeImage(body, MAX_WIDTH);
  if (imageResult.error || !imageResult.body) {
    return corsResponse({ error: true });
  }

  const newName = `bookCovers/${userId}/${uuid()}${path.extname(url) || ".jpg"}`;
  const s3Result = await uploadToS3(newName, imageResult.body);
  return corsResponse(s3Result);
};

module.exports.isbnDbBookCoverLookup = async event => {
  const secrets = await getSecrets();
  const key = secrets["isbn-db-key"];
  const { isbn } = JSON.parse(event.body);

  const result = await new Promise(resolve => {
    request.get(
      `https://api2.isbndb.com/book/${isbn}`,
      {
        headers: {
          Authorization: key
        }
      },
      (a, b, body) => {
        const result = {};
        try {
          const bookResult = JSON.parse(body);
          console.log("Found", bookResult);

          if (bookResult && bookResult.book && bookResult.book.image) {
            result.image = bookResult.book.image;
          }
        } catch (er) {
          console.log("Error", er);
        }
        resolve(result);
      }
    );
  });

  return corsResponse({ result });
};
