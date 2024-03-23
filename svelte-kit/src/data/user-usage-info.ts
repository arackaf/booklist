import { eq, max, count, desc } from "drizzle-orm";
import { db, executeDrizzle } from "./dbUtils";
import { books, userInfoCache } from "./drizzle-schema";
import { db as dynamo, getAuthQueryPacket } from "./dynamoHelpers";

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
  const key = `USER#${userId}`;
  const queryPacket = getAuthQueryPacket(` pk = :key `, {
    ExpressionAttributeValues: { ":key": key }
  });

  console.log({ queryPacket });

  const userInfo = await dynamo.query(queryPacket);

  if (!userInfo.length) {
    return null;
  }

  const userRecord = userInfo.find(record => record.sk?.startsWith("USER#"));
  const providerRecord = userInfo.find(record => record.sk?.startsWith("ACCOUNT#"));

  if (!userRecord) {
    return null;
  }
  const { name, email, image: avatar } = userRecord;
  const result: DynamoUserInfo = { userId, name, email, avatar };

  if (providerRecord) {
    result.provider = providerRecord.provider;
  }

  return result;
};