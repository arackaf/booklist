import "./config/env.js"; // Initialize dotenv before anything else
import { postgresDb } from "./drizzle/db.js";
import { books } from "./drizzle/drizzle-schema.js";
import { getUserAliases } from "./read-dynamo-aliases.js";

async function main() {
  const x = await postgresDb.select().from(books).limit(100);

  for (const book of x) {
    console.log(book.title, book.userId);
  }

  console.log("Getting aliases");

  const aliases = await getUserAliases();
  console.log(aliases);
}

main();
