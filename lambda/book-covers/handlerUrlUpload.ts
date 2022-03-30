import path from "path";
import uuid from "uuid/v4";

import checkLogin from "../util/checkLoginToken";
import { handleCover } from "../util/handleCover";
import corsResponse from "../util/corsResponse";

import downloadFromUrl from "../util/downloadFromUrl";
import { isWarmingCall } from "../util/isWarmingCall";

export const handler = async event => {
  if (isWarmingCall(event)) {
    return corsResponse({ coldStartPrevented: true });
  }

  const { userId, loginToken, url } = JSON.parse(event.body);

  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({});
  }
  const { body, error } = await downloadFromUrl(url);

  if (error) {
    console.log("Error downloading", error);
    return corsResponse({ error: true });
  }
  const extension = path.extname(url) || ".jpg";
  const filePath = `${userId}/${uuid()}${extension}`;

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
