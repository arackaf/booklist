import { eq, max, count, desc } from "drizzle-orm";
import { db, executeDrizzle } from "./dbUtils";
import { books, userInfoCache } from "./drizzle-schema";
import { dynamoOperations, getAuthGSI1QueryPacket, getAuthQueryPacket, getQueryPacket } from "./dynamoHelpers";
import type { StoredUserInfo } from "./types";

export type UserUsageEntry = Awaited<ReturnType<typeof getUserUsageInfo>>[0];

export const getUserUsageInfo = () => {
  const subQuery = db
    .select({ userId: books.userId, books: count().as("books"), latest: max(books.dateAdded).as("latest") })
    .from(books)
    .groupBy(books.userId)
    .as("bookUser");

  return executeDrizzle(
    "User usage info",
    db
      .select({
        userId: subQuery.userId,
        latest: subQuery.latest,
        books: subQuery.books,
        userName: userInfoCache.name,
        avatar: userInfoCache.avatar,
        email: userInfoCache.email,
        provider: userInfoCache.provider,
        lastSync: userInfoCache.lastSync
      })
      .from(subQuery)
      .leftJoin(userInfoCache, eq(userInfoCache.userId, subQuery.userId))
      .orderBy(desc(subQuery.books))
  );
};

// blacklist 5e4071a4496afc003ac61ff4, 5eaf73a50d1a550017a41c74, 60a93babcc3928454b5d1cc6

export const getUserInfoFromDynamo = async (userId: string): Promise<StoredUserInfo | null> => {
  try {
    let user = await getProviderUser(userId);
    if (user != null) {
      console.log("Found", user.userId, user.provider);
      return user;
    }

    const aliasId = await lookupAliasId(userId);

    if (aliasId) {
      const userAttempt2 = await getProviderUser(aliasId);
      if (userAttempt2) {
        console.log("Found with alias", userId, userAttempt2.provider);
        return { ...userAttempt2, userId, aliasUserId: userAttempt2.userId };
      }
    }

    console.log("Legacy user", userId);
    return {
      userId,
      avatar: "",
      email: "",
      name: "",
      provider: "Legacy"
    };
  } catch (err) {
    console.log("Error retrieving user from Dyanmo", err);
    return null;
  }
};

const lookupAliasId = async (userId: string): Promise<string | null> => {
  const pk = `UserReverseAlias#${userId}`;

  const aliasRecordMaybe = await dynamoOperations.query(
    getQueryPacket(` pk = :pk `, {
      ExpressionAttributeValues: { ":pk": pk }
    })
  );

  if (!aliasRecordMaybe.length) {
    return null;
  }

  return aliasRecordMaybe[0].sk;
};

const getProviderUser = async (userId: string): Promise<StoredUserInfo | null> => {
  const googleKey = "ACCOUNT#google";
  const githubKey = "ACCOUNT#github";

  const userKey = `ACCOUNT#${userId}`;

  const googleQueryPacket = getAuthGSI1QueryPacket(` GSI1PK = :pk AND GSI1SK = :sk `, {
    ExpressionAttributeValues: { ":pk": googleKey, ":sk": userKey }
  });
  const githubQueryPacket = getAuthGSI1QueryPacket(` GSI1PK = :pk AND GSI1SK = :sk `, {
    ExpressionAttributeValues: { ":pk": githubKey, ":sk": userKey }
  });

  const [googleUserMaybe, githubUserMaybe] = await Promise.all([
    dynamoOperations.query(googleQueryPacket),
    dynamoOperations.query(githubQueryPacket)
  ]);

  if (!googleUserMaybe.length && !githubUserMaybe.length) {
    console.log("Google nor Github found");
    return null;
  }

  const providerRecord = googleUserMaybe[0] ?? githubUserMaybe[0];
  const { pk, provider } = providerRecord;

  const userRecordMaybe = await dynamoOperations.query(
    getAuthQueryPacket(` pk = :pk AND sk = :sk `, {
      ExpressionAttributeValues: { ":pk": pk, ":sk": pk }
    })
  );

  if (!userRecordMaybe.length) {
    console.log("User record lookup failed");
    return null;
  }

  const userRecord = userRecordMaybe[0];
  const { name, email, image: avatar } = userRecord;

  const result: StoredUserInfo = { userId, name, email, avatar, provider };

  return result;
};
