import { BOOKS_CACHE, getBooksCacheCookie } from "$lib/state/cacheHelpers";
import { writable } from "svelte/store";

export async function load({ url, fetch }: any) {
  const search = url.searchParams.get("search") || "";

  const resp = await fetch("/api/books?search=" + search, {
    headers: { [BOOKS_CACHE]: getBooksCacheCookie() }
  });
  const books = await resp.json();

  return {
    books: writable(books)
  };
}
