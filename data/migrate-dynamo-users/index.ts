import { count } from "drizzle-orm";
import { books, userInfo } from "./drizzle/drizzle-schema";
import { initializePostgres } from "./pg-helper";
import { scanUsers } from "./dynamoHelpers";

async function main() {
  const db = await initializePostgres();

  const users = await scanUsers();

  for (const user of users.Items ?? []) {
    await db.insert(userInfo).values({
      userId: user.userId,
      publicName: user.publicName,
      publicBooksHeader: user.publicBooksHeader,
      isPublic: user.isPublic
    });

    console.log(`Inserted user ${user.userId} ${user.publicName} ${user.publicBooksHeader}`);
  }
}

main();
