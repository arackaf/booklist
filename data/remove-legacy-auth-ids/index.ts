import "./config/env.js"; // Initialize dotenv before anything else
import { db } from "./drizzle/db.js";
import { books } from "./drizzle/drizzle-schema.js";
import { ENV } from "./config/env.js";
import { getUserAliases } from "./read-dynamo-aliases.js";

console.log(ENV.FLY_DB);

async function main() {
  //const x = await db.select().from(books).limit(10);
  //console.log(x);
  const aliases = await getUserAliases();
  console.log(aliases);
}

main();
