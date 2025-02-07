import { db } from "$data/dbUtils";
import { books } from "$data/drizzle/schema";
import { json } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";

export async function POST({ request }) {
  const reqBody = await request.json();

  const { secret, book } = reqBody;
  book.dateAdded = new Date(book.dateAdded);
  try {
    book.authors = book.authors == null ? [] : JSON.parse(book.authors);
  } catch (er) {
    book.authors = [];
  }

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
