import { db, getGetPacket } from "../util/dynamoHelpers";

const TABLE_NAME = `My_Library_${process.env.STAGE}`;

export default async function checkLoginToken(userId, loginToken) {
  const pk = `UserLogin#${userId}`;
  const sk = `LoginToken#${loginToken}`;

  try {
    const result = await db.get(getGetPacket(pk, sk));
    return !!result;
  } catch (er) {
    return false;
  }
}
