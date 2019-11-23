import localStorage from "util/localStorage";
import { useContext, useReducer } from "react";
import { AppContext } from "app/renderUI";

type UI_ACTIONS = "SET_GRID_VIEW" | "SET_BASIC_LIST_VIEW" | "SET_COVERS_LIST_VIEW";

const GRID_VIEW = "books table view";
const BASIC_LIST_VIEW = "books mobile view";
const COVERS_LIST = "books covers view";

const bookUiInitialState = {
  view: localStorage.get("book-ui") as any
};
export type BookUiState = typeof bookUiInitialState;

export function bookUiReducer(state = bookUiInitialState, action: { type: UI_ACTIONS }): BookUiState {
  switch (action.type) {
    case "SET_BASIC_LIST_VIEW":
      localStorage.set("book-ui", BASIC_LIST_VIEW);
      return { view: BASIC_LIST_VIEW };
    case "SET_GRID_VIEW":
      localStorage.set("book-ui", GRID_VIEW);
      return { view: GRID_VIEW };
    case "SET_COVERS_LIST_VIEW":
      localStorage.set("book-ui", COVERS_LIST);
      return { view: COVERS_LIST };
  }
}

export const useBookSearchUiView = () => {
  let [app] = useContext(AppContext);
  let [{ view }, dispatch] = useReducer(bookUiReducer, bookUiInitialState);

  let isGridView = view == GRID_VIEW || (!view && app.showingDesktop);
  let isBasicList = view == BASIC_LIST_VIEW || (!view && app.showingMobile);
  let isCoversList = view == COVERS_LIST;

  return {
    isGridView,
    isBasicList,
    isCoversList,
    dispatch
  };
};
