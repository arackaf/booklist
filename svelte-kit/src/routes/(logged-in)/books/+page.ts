import { BOOKS_CACHE, getBooksCacheCookie } from "$lib/state/cacheHelpers";
import { writable } from "svelte/store";

export async function load({ url, fetch, setHeaders }: any) {
  const search = url.searchParams.get("search") || "";

  let headers = {} as any;
  const cacheValue = getBooksCacheCookie();
  if (cacheValue) {
    headers[BOOKS_CACHE] = cacheValue;
  }

  const resp = await fetch("/api/books?search=" + search, { headers });
  const books = await resp.json();

  return {
    books: writable(books)
  };
}
