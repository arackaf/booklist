import { searchBooks } from "$data/books";
import { BOOKS_CACHE } from "$lib/state/cacheHelpers";
import { json } from "@sveltejs/kit";

export async function GET({ url, cookies, request, setHeaders }: { url: URL; cookies: any; request: any; setHeaders: any }) {
  const currentCacheBust = request.headers.get(BOOKS_CACHE);

  if (!currentCacheBust) {
    cookies.set(BOOKS_CACHE, +new Date(), { path: "/", httpOnly: false });
  } else {
    setHeaders({
      "cache-control": "max-age=60",
      Vary: BOOKS_CACHE
    });
  }

  const search = url.searchParams.get("search") || "";

  const books = await searchBooks(search);

  return json(books);
}
