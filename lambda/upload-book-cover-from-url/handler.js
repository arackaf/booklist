const path = require("path");
const uuid = require("uuid/v4");

const checkLogin = require("../util/checkLoginToken");
const resizeImage = require("../util/resizeImage");
const corsResponse = require("../util/corsResponse");
const uploadToS3 = require("../util/uploadToS3");
const downloadFromUrl = require("../util/downloadFromUrl");

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

  const newName = `___xyzabc__/bookCovers/__temppp/${userId}/${uuid()}${path.extname(url) || ".jpg"}`;
  const s3Result = await uploadToS3(newName, imageResult.body);
  return corsResponse(s3Result);
};
