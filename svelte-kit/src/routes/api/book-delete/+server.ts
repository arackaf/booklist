import { deleteBook } from "$data/books.js";
import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers.js";
import { json } from "@sveltejs/kit";

export async function POST({ locals, request, cookies }) {
  const session = await locals.getSession();
  if (!session) {
    return json({ success: false });
  }

  const reqBody = await request.json();

  const { id } = reqBody;
  const { userId } = session;

  try {
    await deleteBook(userId, id);
    updateCacheCookie(cookies, BOOKS_CACHE);

    return json({ success: true });
  } catch (er) {
    return json({ error: true });
  }
}
