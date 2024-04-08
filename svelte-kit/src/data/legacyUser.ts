import md5 from "blueimp-md5";

import { db, getQueryPacket, getPutPacket } from "./dynamoHelpers";

const getUserAliasKey = (userId: string) => `UserAlias#${userId}`;
const getUserReverseAliasKey = (userId: string) => `UserReverseAlias#${userId}`;

export async function lookupUser(email: string, password: string, salt: string) {
  email = email.toLowerCase();
  password = saltAndHashPassword(password, salt);
  const userKey = `User#${email}`;

  try {
    let userFound = await db.queryOne(
      getQueryPacket(` pk = :userKey AND sk = :userKey `, {
        ExpressionAttributeValues: { ":password": password, ":userKey": userKey, ":true": true },
        FilterExpression: ` password = :password AND awaitingActivation <> :true `
      })
    );

    if (!userFound) {
      return null;
    }

    const id = userFound.userId;

    return {
      id
    };
  } catch (loginErr) {
    console.log("Login error", loginErr);
    return null;
  }
}

const legacyUserCache = new Map<string, string>();

export async function syncUser(newId: string, legacyId: string) {
  const userSync = {
    pk: getUserAliasKey(newId),
    sk: legacyId
  };

  legacyUserCache.set(newId, legacyId);
  db.put(getPutPacket(userSync));

  const reverseAlias = {
    pk: getUserReverseAliasKey(legacyId),
    sk: newId
  };
  db.put(getPutPacket(reverseAlias));
}

export async function getUserSync(userId: string): Promise<string | null> {
  if (legacyUserCache.has(userId)) {
    console.log("Legacy user cache hit");
    return legacyUserCache.get(userId)!;
  }
  const key = getUserAliasKey(userId);

  try {
    const syncEntry = await db.queryOne(
      getQueryPacket(` pk = :key `, {
        ExpressionAttributeValues: { ":key": key }
      })
    );

    if (syncEntry) {
      legacyUserCache.set(userId, syncEntry.sk);
    }
    return syncEntry?.sk;
  } catch (er) {
    console.log("Error getting user sync", er);
    return null;
  }
}

function saltAndHashPassword(password: string, salt: string) {
  return md5(`${salt}${password}${salt}`);
}
