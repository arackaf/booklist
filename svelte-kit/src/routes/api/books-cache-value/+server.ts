import { json } from "@sveltejs/kit";
import { BOOKS_CACHE } from "$lib/state/cacheHelpers";

export async function GET({ cookies }: any) {
  return json({ booksCache: cookies.get(BOOKS_CACHE) });
}
