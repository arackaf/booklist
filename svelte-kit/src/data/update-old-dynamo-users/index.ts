import dotenv from "dotenv";
import { db, initializePostgres } from "$data/dbUtils";
import { books, userInfoCache } from "$data/drizzle-schema";
import { eq, exists, not, sql } from "drizzle-orm";
import { dynamoOperations, getAuthGSI1QueryPacket, getAuthQueryPacket, initializeDynamo } from "$data/dynamoHelpers";
import type { StoredUserInfo } from "$data/types";

dotenv.config({ path: ".env" });

async function main() {
  const connectionString = process.env.FLY_DB!;
  console.log(connectionString);

  const { BOOKLIST_DYNAMO, AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, DYNAMO_AUTH_TABLE } = process.env as any;

  initializePostgres({ connectionString });
  initializeDynamo({
    tableName: BOOKLIST_DYNAMO,
    authTableName: DYNAMO_AUTH_TABLE,
    accessKey: AMAZON_ACCESS_KEY,
    secretKey: AMAZON_SECRET_KEY
  });

  const missingUserIds = await db
    .selectDistinct({ userId: books.userId })
    .from(books)
    .where(
      not(
        exists(
          db
            .select({ _: sql`1` })
            .from(userInfoCache)
            .where(eq(userInfoCache.userId, books.userId))
        )
      )
    );

  let i = 1;
  for (const entry of missingUserIds) {
    console.log("--------------------------------");
    console.log(i++, entry.userId);
    const user = await getProviderUser(entry.userId);

    console.log(user);

    await db.insert(userInfoCache).values({
      userId: entry.userId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar ?? "",
      provider: user?.provider ?? "",
      lastSync: +new Date()
    });

    console.log("Saved");

    console.log("--------------------------------");
  }
}

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

main();
