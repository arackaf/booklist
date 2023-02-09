import { writable } from "svelte/store";

export const DEFAULT_BOOKS_PAGE_SIZE = 50;

export const EMPTY_BOOKS_RESULTS = { books: [], totalBooks: 0, page: 0, totalPages: 0 };
export const EMPTY_BOOKS_RESULTS_CLIENT = {
  books: writable([]),
  totalBooks: writable(0),
  page: 0,
  totalPages: 0
};
