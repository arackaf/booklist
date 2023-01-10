import { searchBooks } from "$data/books";
import type { BookSearch } from "$data/types";
import { BOOKS_CACHE } from "$lib/state/cacheHelpers";
import { json } from "@sveltejs/kit";

export async function GET({ url, setHeaders, locals }: { url: URL; cookies: any; request: any; setHeaders: any; locals: any }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  setHeaders({
    "cache-control": "max-age=60",
    Vary: BOOKS_CACHE
  });

  const search = url.searchParams.get("search") || "";
  const sortString = url.searchParams.get("sort") || "";

  const packet: BookSearch = {
    search
  };

  if (sortString) {
    const [field, dir] = sortString.split("-");
    packet.sort = {
      [field]: dir === "desc" ? -1 : 1
    };
  }

  const books = await searchBooks(session.userId, packet);

  return json(books);
}
