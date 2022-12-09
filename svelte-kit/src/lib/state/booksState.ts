import type { Book } from "$data/types";
import { get, type Writable } from "svelte/store";

export type UpdatesTo<T> = {
  fieldsSet: Partial<T>;
};

export const updateBook = (currentBooks: Writable<Book[]>, _id: string, updates: UpdatesTo<Book>) => {
  updateBooks(currentBooks, [_id], updates);
};

export const updateBooks = (booksStore: Writable<Book[]>, _ids: string[], updates: UpdatesTo<Book>) => {
  const currentBooks = get(booksStore);

  const { fieldsSet } = updates;
  const _idLookup = new Set(_ids);

  const updatedBooks = currentBooks.map((book: any) => {
    if (!_idLookup.has(book._id)) {
      return book;
    }

    const result = Object.assign({}, book, fieldsSet);
    return result;
  });

  booksStore.set(updatedBooks);
};
