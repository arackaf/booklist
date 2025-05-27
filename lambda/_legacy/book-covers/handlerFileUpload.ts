import path from "path";
import uuid from "uuid/v4";
import awsMultiPartParser from "lambda-multipart-parser";

import checkLogin from "../../util/checkLoginToken";
import corsResponse from "../../util/corsResponse";
import { isWarmingCall } from "../../util/isWarmingCall";
import { handleCover } from "../../util/handleCover";

export const handler = async event => {
  if (isWarmingCall(event)) {
    return corsResponse({ coldStartPrevented: true });
  }

  const formPayload = await awsMultiPartParser.parse(event);
  const { userId, loginToken } = formPayload;
  const file = formPayload.files[0];

  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({});
  }

  const extension = path.extname(file.filename) || ".jpg";
  const filePath = `${userId}/${uuid()}${extension}`;
  const body = file.content;

  const allResults = await Promise.all([
    handleCover(body, "mobile", `mobile-covers/${filePath}`),
    handleCover(body, "small", `small-covers/${filePath}`),
    handleCover(body, "medium", `medium-covers/${filePath}`)
  ]);

  if (allResults.every(r => r.STATUS === "error") || allResults.every(r => r.STATUS === "invalid-size")) {
    return corsResponse({ status: allResults[0].STATUS });
  }

  const [mobile, small, medium] = allResults;

  return corsResponse({
    success: true,
    mobile,
    small,
    medium
  });
};
