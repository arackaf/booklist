import { BOOKS_CACHE, getCurrentCookieValue } from "$lib/state/cacheHelpers";
import { EMPTY_BOOKS_RESULTS_CLIENT } from "$lib/state/dataPlaceholders";
import { ensureAnyUser } from "$lib/util/authCheck";
import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";
import type { Book } from "$data/types";
import { createShallowReactiveArray, ref } from "$lib/state/reactivityHelpers.svelte";

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
    totalBooks: ref(totalBooks),
    books: createShallowReactiveArray(books as Book[]),
    page,
    totalPages
  };
}
