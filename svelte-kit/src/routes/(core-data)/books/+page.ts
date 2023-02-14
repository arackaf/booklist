import { BOOKS_CACHE, getCurrentCookieValue } from "$lib/state/cacheHelpers";
import { EMPTY_BOOKS_RESULTS_CLIENT } from "$lib/state/dataConstants";
import { writable } from "svelte/store";
import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";

const getInitialBooksCache = (fetch: any) =>
  fetch("/api/books-cache-value")
    .then((resp: any) => resp.json())
    .then((obj: any) => obj.booksCache);

export async function load({ url, parent, fetch, depends }: any) {
  depends("reload:books");

  const cache = getCurrentCookieValue(BOOKS_CACHE) || (await getInitialBooksCache(fetch));

  const resp = await fetch(`/api/books?${url.searchParams.toString()}&cache=${cache}`);
  const { books, totalBooks, page, totalPages } = await resp.json();

  const parentData = await parent();
  const { uxState, showMobile, isMobile } = parentData;
  const defaultBookView = uxState.bkVw ?? (showMobile ? BASIC_LIST_VIEW : GRID_VIEW);

  if (parentData.hasPublicId && !parentData.isPublic) {
    return {
      defaultBookView,
      ...EMPTY_BOOKS_RESULTS_CLIENT
    };
  }

  return {
    defaultBookView,
    totalBooks: writable(totalBooks),
    books: writable(books),
    page,
    totalPages
  };
}
