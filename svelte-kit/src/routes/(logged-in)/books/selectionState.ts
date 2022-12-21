import { derived, get, writable } from "svelte/store";

const selectedBooks = writable([] as string[]);
export const selectedBooksLookup = derived(selectedBooks, $selectedBooks => {
  return $selectedBooks.reduce<{ [s: string]: true }>((result, _id) => {
    result[_id] = true;
    return result;
  }, {});
});

export const selectionState = {
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
