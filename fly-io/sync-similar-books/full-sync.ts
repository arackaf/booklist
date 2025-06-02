import "./util/config";

import { initializePostgres } from "./util/dbUtils";
import { books as booksTable } from "./drizzle/drizzle-schema";

const db = initializePostgres();

async function main() {
  const books = await db.select({ id: booksTable.id, title: booksTable.title }).from(booksTable).limit(10);

  console.log({ books });
}

main();
