import { db, getGetPacket, getPutPacket, getUpdatePacket } from "./dynamoHelpers";
import type { DynamoUser } from "./types";

const getUserKey = (userId: string) => `UserId#${userId}`;

export async function getUser(userId: string, consistentRead: boolean = false): Promise<DynamoUser | null> {
  const userKey = getUserKey(userId);

  try {
    let userFound: DynamoUser | null = (await db.get(getGetPacket(userKey, userKey, { ConsistentRead: consistentRead }))) as DynamoUser;

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

export async function updateUser(userId: string, isPublic: boolean, publicName: string, publicBooksHeader: string) {
  const userKey = getUserKey(userId);

  await db.update(
    getUpdatePacket(userKey, userKey, {
      UpdateExpression: "SET isPublic = :isPublic, publicName = :publicName, publicBooksHeader = :publicBooksHeader",
      ExpressionAttributeValues: { ":isPublic": isPublic, ":publicName": publicName, ":publicBooksHeader": publicBooksHeader }
    })
  );
}
