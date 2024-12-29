import type { Book } from "$data/types";

class SelectionState {
  selectedBooks = $state<number[]>([]);

  selectedBooksLookup = $derived(
    this.selectedBooks.reduce<{ [s: string]: true }>((result, id) => {
      result[id] = true;
      return result;
    }, {})
  );

  selectAll(books: Book[]) {
    this.selectedBooks.length = 0;
    this.selectedBooks.push(...books.map(b => b.id));
  }

  selectBook(id: number) {
    if (!this.selectedBooksLookup[id]) {
      this.selectedBooks.push(id);
    }
  }

  unSelectBook(id: number) {
    const idx = this.selectedBooks.indexOf(id);
    if (idx >= 0) {
      this.selectedBooks.splice(idx, 1);
    }
  }

  toggle(id: number) {
    if (this.selectedBooksLookup[id]) {
      this.unSelectBook(id);
    } else {
      this.selectBook(id);
    }
  }
  clear() {
    this.selectedBooks.length = 0;
  }
}

export const selectionState = new SelectionState();
