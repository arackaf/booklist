import { db, getGetPacket, getPutPacket } from "./dynamoHelpers";

const getUserKey = (userId: string) => `UserId#${userId}`;

export async function getUser(userId: string) {
  const userKey = getUserKey(userId);

  try {
    let userFound = await db.get(getGetPacket(userKey, userKey));

    return userFound ?? null;
  } catch (loginErr) {
    console.log("Login error", loginErr);
    return null;
  }
}

export async function createUser(userId: string) {
  const userKey = getUserKey(userId);

  const userObject = {
    pk: userKey,
    sk: userKey,
    userId,
    isPublic: false,
    publicName: "",
    publicBooksHeader: ""
  };

  db.put(getPutPacket(userObject));
}
