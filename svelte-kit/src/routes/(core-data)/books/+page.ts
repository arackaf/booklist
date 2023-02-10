import { BOOKS_CACHE, getCurrentCookieValue } from "$lib/state/cacheHelpers";
import { writable } from "svelte/store";
import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";

export async function load({ url, parent, fetch, depends }: any) {
  depends("reload:books");

  const isClient = typeof document === "object";
  const cache = isClient ? getCurrentCookieValue(BOOKS_CACHE) : globalThis.initialBooksCache;

  const resp = await fetch(`/api/books?${url.searchParams.toString()}&cache=${cache}`);
  const { books, totalBooks, page, totalPages } = await resp.json();

  const parentData = await parent();
  const { uxState, showMobile } = parentData;

  const defaultBookView = uxState.bkVw ?? (showMobile ? BASIC_LIST_VIEW : GRID_VIEW);

  return {
    defaultBookView,
    totalBooks: writable(totalBooks),
    books: writable(books),
    page,
    totalPages
  };
}
