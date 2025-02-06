import { dynamoOperations, getQueryPacket } from "./dynamoHelpers";

const getUserAliasKey = (userId: string) => `UserAlias#${userId}`;

const legacyUserCache = new Map<string, string>();

export async function getUserSync(userId: string): Promise<string | null> {
  if (legacyUserCache.has(userId)) {
    console.log("Legacy user cache hit");
    return legacyUserCache.get(userId)!;
  }
  const key = getUserAliasKey(userId);

  try {
    const syncEntry = await dynamoOperations.queryOne(
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
