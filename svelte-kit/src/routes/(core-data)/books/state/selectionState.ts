import { derived, get, writable } from "svelte/store";
import type { Book } from "$data/types";

export const selectedBooks = writable([] as number[]);

export const selectedBooksLookup = derived(selectedBooks, $selectedBooks => {
  return $selectedBooks.reduce<{ [s: string]: true }>((result, id) => {
    result[id] = true;
    return result;
  }, {});
});

export const selectionState = {
  selectAll(books: Book[]) {
    selectedBooks.set(books.map(b => b.id));
  },
  selectBook(id: number) {
    selectedBooks.update(books => books.concat(id));
  },
  unSelectBook(id: number) {
    selectedBooks.update(books => books.filter(bookId => bookId !== id));
  },
  toggle(id: number) {
    if (get(selectedBooksLookup)[id]) {
      this.unSelectBook(id);
    } else {
      this.selectBook(id);
    }
  },
  clear() {
    selectedBooks.set([]);
  }
};
