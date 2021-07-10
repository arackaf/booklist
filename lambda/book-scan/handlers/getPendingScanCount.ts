import corsResponse from "../../util/corsResponse";
import checkLoginToken from "../../util/checkLoginToken";
import { getUserScanStatusKey } from "../scan-helpers";
import { db, getGetPacket } from "../../util/dynamoHelpers";

export const handler = async event => {
  try {
    const userId = event.queryStringParameters.userId;
    const loginToken = event.queryStringParameters.loginToken;

    const scanStatusKey = getUserScanStatusKey(userId);

    if (!(await checkLoginToken(userId, loginToken))) {
      return corsResponse({ error: true, badLogin: true });
    }

    const status = await db.get(getGetPacket(scanStatusKey, scanStatusKey));
    console.log("SENDING", { pendingCount: status?.pendingCount ?? 0 });

    return corsResponse({ userId, pendingCount: status?.pendingCount ?? 0 });
  } catch (er) {
    console.log("ERROR", er);
    return corsResponse({ error: true });
  }
};
