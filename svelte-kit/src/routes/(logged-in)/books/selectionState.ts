import { derived, get, writable } from "svelte/store";
import type { Book } from "$data/types";

export const selectedBooks = writable([] as string[]);

export const selectedBooksLookup = derived(selectedBooks, $selectedBooks => {
  return $selectedBooks.reduce<{ [s: string]: true }>((result, _id) => {
    result[_id] = true;
    return result;
  }, {});
});

export const selectionState = {
  selectAll(books: Book[]) {
    selectedBooks.set(books.map(b => b._id));
  },
  selectBook(_id: string) {
    selectedBooks.update(books => books.concat(_id));
  },
  unSelectBook(_id: string) {
    selectedBooks.update(books => books.filter(bookId => bookId !== _id));
  },
  toggle(_id: string) {
    if (get(selectedBooksLookup)[_id]) {
      this.unSelectBook(_id);
    } else {
      this.selectBook(_id);
    }
  },
  clear() {
    selectedBooks.set([]);
  }
};
