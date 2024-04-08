import { writable, type Writable } from "svelte/store";
import { BOOKS_CACHE, getCurrentCookieValue } from "$lib/state/cacheHelpers";
import { ensureAnyUser } from "$lib/util/authCheck";
import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";
import type { Book } from "$data/types";

const EMPTY_BOOKS_RESULTS_CLIENT = {
  books: writable([] as Book[]),
  totalBooks: writable(0),
  page: 0,
  totalPages: 0
};

export async function load({ url, parent, fetch, depends }) {
  depends("reload:books");

  await ensureAnyUser({ parent, url });

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
    books: writable(books) as Writable<Book[]>,
    page,
    totalPages
  };
}
