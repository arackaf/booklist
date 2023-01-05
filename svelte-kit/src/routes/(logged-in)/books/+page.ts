import { BOOKS_CACHE, getCachingHeaders } from "$lib/state/cacheHelpers";
import { writable } from "svelte/store";

export async function load({ url, fetch, depends }: any) {
  depends("reload-books");

  const resp = await fetch("/api/books?" + url.searchParams.toString(), {
    headers: getCachingHeaders(BOOKS_CACHE)
  });
  const books = await resp.json();

  return {
    books: writable(books)
  };
}
