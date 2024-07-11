import type { Book } from "$data/types";
import { writable } from "svelte/store";
import { createReactiveArray, createState } from "./universalReactivityHelpers.svelte";

export const DEFAULT_BOOKS_PAGE_SIZE = 50;

export const EMPTY_BOOKS_RESULTS = { books: [], totalBooks: 0, page: 0, totalPages: 0 };
export const EMPTY_BOOKS_RESULTS_CLIENT = {
  books: createReactiveArray([] as Book[]),
  totalBooks: createState(0),
  page: 0,
  totalPages: 0
};
