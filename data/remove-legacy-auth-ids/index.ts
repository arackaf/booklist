import { eq } from "drizzle-orm";
import "./config/env.js"; // Initialize dotenv before anything else
import { postgresDb, pool } from "./drizzle/db.js";
import { books, booksSubjects, booksTags, subjects, tags, userInfoCache } from "./drizzle/drizzle-schema.js";
import { getUserAliases } from "./read-dynamo-aliases.js";

async function main() {
  console.log("Getting aliases");

  const aliases = await getUserAliases();

  for (const alias of aliases) {
    console.log(alias.pk, alias.sk);

    const accountId = alias.pk.split("#")[1];
    const existingUserId = alias.sk;

    console.log("Updating user", existingUserId, "to", accountId);

    try {
      await postgresDb.transaction(async tx => {
        await tx
          .update(books)
          .set({
            userId: accountId
          })
          .where(eq(books.userId, existingUserId));

        await tx
          .update(booksTags)
          .set({
            userId: accountId
          })
          .where(eq(booksTags.userId, existingUserId));

        await tx
          .update(booksSubjects)
          .set({
            userId: accountId
          })
          .where(eq(booksSubjects.userId, existingUserId));

        await tx
          .update(subjects)
          .set({
            userId: accountId
          })
          .where(eq(subjects.userId, existingUserId));

        await tx
          .update(tags)
          .set({
            userId: accountId
          })
          .where(eq(tags.userId, existingUserId));

        await tx
          .update(userInfoCache)
          .set({
            userId: accountId
          })
          .where(eq(userInfoCache.userId, existingUserId));

        await tx.rollback();
      });
    } catch (error) {
      console.error("Error updating user", existingUserId, "to", accountId, error);
    }

    console.log("User updated");
  }

  pool.end();
}

main();
