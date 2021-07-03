import path from "path";
import uuid from "uuid/v4";
import awsMultiPartParser from "lambda-multipart-parser";

import checkLogin from "../util/checkLoginToken";
import resizeImage from "../util/resizeImage";
import corsResponse from "../util/corsResponse";
import uploadToS3 from "../util/uploadToS3";
import { isWarmingCall } from "../util/isWarmingCall";

export const handler = async event => {
  if (isWarmingCall(event)) {
    return corsResponse({ coldStartPrevented: true });
  }

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
