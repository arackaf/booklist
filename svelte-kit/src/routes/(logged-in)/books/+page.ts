import { BOOKS_CACHE, getCurrentCookieValue } from "$lib/state/cacheHelpers";
import { writable } from "svelte/store";

export async function load({ url, data, fetch, depends }: any) {
  depends("reload-books");

  const cache = data.booksCache || getCurrentCookieValue(BOOKS_CACHE);

  const resp = await fetch(`/api/books?${url.searchParams.toString()}&cache=${cache}`);
  const books = await resp.json();

  return {
    books: writable(books)
  };
}
