import corsResponse from "../../../util/corsResponse";
import checkLoginToken from "../../../util/checkLoginToken";
import { getPendingCount } from "../util/data-helpers";

export const handler = async event => {
  try {
    const userId = event.queryStringParameters.userId;
    const loginToken = event.queryStringParameters.loginToken;

    if (!(await checkLoginToken(userId, loginToken))) {
      return corsResponse({ error: true, badLogin: true });
    }

    const pendingCount = await getPendingCount(userId);

    console.log("SENDING", { pendingCount });
    return corsResponse({ userId, pendingCount });
  } catch (er) {
    console.log("ERROR", er);
    return corsResponse({ error: true });
  }
};
