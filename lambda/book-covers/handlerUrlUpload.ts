import path from "path";

import checkLogin from "../util/checkLoginToken";
import { handleCover } from "../util/handleCover";
import corsResponse from "../util/corsResponse";

import downloadFromUrl from "../util/downloadFromUrl";
import { isWarmingCall } from "../util/isWarmingCall";

export const handler = async event => {
  if (isWarmingCall(event)) {
    return corsResponse({ coldStartPrevented: true });
  }

  const { userId, loginToken, size, url } = JSON.parse(event.body);

  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({});
  }
  const { body, error } = await downloadFromUrl(url);

  if (error) {
    console.log("Error downloading", error);
    return corsResponse({ error: true });
  }
  const extension = path.extname(url) || ".jpg";

  return handleCover(body, size, userId, extension);
};
