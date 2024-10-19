import { db } from "$data/dbUtils.js";
import { books } from "$data/drizzle-schema.js";
import { json } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";

export async function POST({ request }) {
  const reqBody = await request.json();

  const { secret, book } = reqBody;
  book.dateAdded = new Date(book.dateAdded);

  if (secret !== env.SAVE_BOOK_SECRET) {
    console.log("Invalid secret");
    return json({ success: true });
  }

  try {
    console.log("Saving new book");
    await db.insert(books).values(book);
    console.log("New books saved");

    return json({ success: true });
  } catch (er) {
    console.log("Error saving book", er);
    return json({ error: true });
  }
}
