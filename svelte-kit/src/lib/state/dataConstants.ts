import type { Book } from "$data/types";
import { ref } from "./reactivityHelpers.svelte";

export const DEFAULT_BOOKS_PAGE_SIZE = 50;

export const EMPTY_BOOKS_RESULTS = { books: [], totalBooks: 0, page: 0, totalPages: 0 };
export const EMPTY_BOOKS_RESULTS_CLIENT = {
  books: [] as Book[],
  totalBooks: ref(0),
  page: 0,
  totalPages: 0
};
