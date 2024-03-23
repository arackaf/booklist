import { eq, max, count, desc } from "drizzle-orm";
import { db, executeDrizzle } from "./dbUtils";
import { books, userInfoCache } from "./drizzle-schema";
import { db as dynamo, getAuthGSI1QueryPacket, getAuthQueryPacket, getQueryPacket } from "./dynamoHelpers";

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
      .orderBy(desc(subQuery.latest))
  );
};

export type DynamoUserInfo = {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  provider?: string;
};

export const getUserInfoFromDynamo = async (userId: string): Promise<DynamoUserInfo | null> => {
  const googleKey = "ACCOUNT#google";
  const githubKey = "ACCOUNT#github";

  const userKey = `ACCOUNT#${userId}`;

  const googleQueryPacket = getAuthGSI1QueryPacket(` GSI1PK = :pk AND GSI1SK = :sk `, {
    ExpressionAttributeValues: { ":pk": googleKey, ":sk": userKey }
  });
  const githubQueryPacket = getAuthGSI1QueryPacket(` GSI1PK = :pk AND GSI1SK = :sk `, {
    ExpressionAttributeValues: { ":pk": githubKey, ":sk": userKey }
  });

  const [googleUserMaybe, githubUserMaybe] = await Promise.all([dynamo.query(googleQueryPacket), dynamo.query(githubQueryPacket)]);

  if (!googleUserMaybe.length && !githubUserMaybe.length) {
    console.log("Google nor Github found");
    return null;
  }

  const providerRecord = googleUserMaybe[0] ?? githubUserMaybe[0];
  const { pk, provider } = providerRecord;

  const userRecordMaybe = await dynamo.query(
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

  const result: DynamoUserInfo = { userId, name, email, avatar, provider };

  return result;
};
