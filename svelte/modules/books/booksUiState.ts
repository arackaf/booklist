import { get, derived } from "svelte/store";

import { appState } from "app/state/appState";
import localStorage from "util/localStorage";
import useReducer from "util/useReducer";

type UI_ACTIONS = "SET_GRID_VIEW" | "SET_BASIC_LIST_VIEW" | "SET_COVERS_LIST_VIEW";

const GRID_VIEW = "books table view";
const BASIC_LIST_VIEW = "books mobile view";
const COVERS_LIST = "books covers view";

export interface BookUiState {
  view: string;
}

export function bookUiReducer(state, action: { type: UI_ACTIONS }): BookUiState {
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

export const getBookSearchUiView = () => {
  const bookUiInitialState = {
    view: localStorage.get("book-ui") as any
  };

  let [uiState, dispatch] = useReducer<BookUiState>(bookUiReducer, bookUiInitialState);

  return derived([appState, uiState], ([$appState, $uiState]) => {
    let { showingDesktop, showingMobile } = $appState;
    let { view } = $uiState;

    let isGridView = view == GRID_VIEW || (!view && showingDesktop);
    let isBasicList = view == BASIC_LIST_VIEW || (!view && showingMobile);
    let isCoversList = view == COVERS_LIST;

    return {
      isGridView,
      isBasicList,
      isCoversList,
      dispatch
    };
  });
};
