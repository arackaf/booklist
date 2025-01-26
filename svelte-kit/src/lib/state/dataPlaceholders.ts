import type { Book } from "$data/types";
import { ref } from "./reactivityHelpers.svelte";

export const EMPTY_BOOKS_RESULTS_CLIENT = {
  books: [] as Book[],
  totalBooks: ref(0),
  page: 0,
  totalPages: 0
};
