import dotenv from "dotenv";
import { db, initializePostgres } from "$data/dbUtils";
import { books, userInfoCache } from "$data/drizzle-schema";
import { eq, exists, not, sql } from "drizzle-orm";

dotenv.config({ path: ".env" });

async function main() {
  const connectionString = process.env.FLY_DB!;
  console.log(connectionString);

  initializePostgres({ connectionString });

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

  for (const entry of missingUserIds) {
    console.log(entry.userId);
  }
}

main();
