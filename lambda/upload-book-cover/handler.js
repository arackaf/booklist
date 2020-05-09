const path = require("path");
const uuid = require("uuid/v4");
const awsMultiPartParser = require("lambda-multipart-parser");

const checkLogin = require("../util/checkLoginToken");
const resizeImage = require("../util/resizeImage");
const corsResponse = require("../util/corsResponse");
const uploadToS3 = require("../util/uploadToS3");

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
  const { body } = imageResult;
  
  const s3Result = await uploadToS3(newName, body);
  return corsResponse(s3Result);
};
