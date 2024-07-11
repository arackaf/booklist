import { get } from "svelte/store";

import { page } from "$app/stores";
import { runDelete } from "$lib/state/dataUpdates";

import { selectionState } from "./selectionState";

export const afterDelete = (id: number) => {
  runDelete(get(page).data.books, id);

  get(page).data.totalBooks.value--;
  selectionState.unSelectBook(id);
};
