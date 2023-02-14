import { BOOKS_CACHE, getCurrentCookieValue } from "$lib/state/cacheHelpers";
import { EMPTY_BOOKS_RESULTS_CLIENT } from "$lib/state/dataConstants";
import { writable } from "svelte/store";
import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";

export async function load({ url, parent, fetch, depends, ...rest }: any) {
  depends("reload:books");

  const parentData = await parent();
  const { uxState, showMobile, isMobile } = parentData;
  const defaultBookView = uxState.bkVw ?? (showMobile ? BASIC_LIST_VIEW : GRID_VIEW);

  const cache = getCurrentCookieValue(BOOKS_CACHE) || parentData.booksCache;

  if (parentData.hasPublicId && !parentData.isPublic) {
    return {
      defaultBookView,
      ...EMPTY_BOOKS_RESULTS_CLIENT
    };
  }

  const resp = await fetch(`/api/books?${url.searchParams.toString()}&cache=${cache}&is-mobile=${isMobile}`);
  const { books, totalBooks, page, totalPages } = await resp.json();

  return {
    defaultBookView,
    totalBooks: writable(totalBooks),
    books: writable(books),
    page,
    totalPages
  };
}
