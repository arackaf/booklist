import { db, getGetPacket } from "./dynamoHelpers";

export const getSecrets = async () => {
  try {
    const secretsPacket = await db.get(getGetPacket("#SECRETS", "#SECRETS"));
    return secretsPacket.value;
  } catch (er) {
    console.log("Error reading secrets", er);
    throw er;
  }
};
