import { page } from "$app/state";
import { runDelete } from "$lib/state/dataUpdates";

import { selectionState } from "./selectionState.svelte";

export const afterDelete = (id: number) => {
  runDelete(page.data.books, id);

  page.data.totalBooks.value--;
  selectionState.unSelectBook(id);
};
