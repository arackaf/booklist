import { searchBooks } from "$data/books";
import { BOOKS_CACHE } from "$lib/state/cacheHelpers";
import { json } from "@sveltejs/kit";

export async function GET({ url, request, setHeaders, locals }: { url: URL; cookies: any; request: any; setHeaders: any; locals: any }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  const currentCacheBust = request.headers.get(BOOKS_CACHE);

  if (currentCacheBust) {
    setHeaders({
      "cache-control": "max-age=60",
      Vary: BOOKS_CACHE
    });
  }

  const search = url.searchParams.get("search") || "";

  const books = await searchBooks(session.userId, search);

  return json(books);
}
