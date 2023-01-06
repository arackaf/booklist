import { writable, derived } from "svelte/store";
import localStorage from "$lib/util/localStorage";

export type GRID_VIEW = "books table view";
export type BASIC_LIST_VIEW = "books mobile view";
export type COVERS_LIST = "books covers view";

export const GRID_VIEW = "books table view";
export const BASIC_LIST_VIEW = "books mobile view";
export const COVERS_LIST = "books covers view";

export type ValidUiViews = GRID_VIEW | BASIC_LIST_VIEW | COVERS_LIST;

const _uiView = writable(localStorage.get("book-ui") || GRID_VIEW);
export const uiView = derived(_uiView, val => val);

export const setUiView = (val: string) => {
  _uiView.set(val);
};
