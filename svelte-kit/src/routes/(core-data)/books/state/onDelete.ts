import { page } from "$app/state";
import { runDelete } from "$lib/state/dataUpdates";

import { selectionState } from "./selectionState";

export const afterDelete = (id: number) => {
  runDelete(page.data.books, id);

  page.data.totalBooks.value--;
  selectionState.unSelectBook(id);
};
