import { get, derived } from "svelte/store";

import { appState } from "app/state/appState";
import localStorage from "util/localStorage";
import useReducer from "util/useReducer";
import { preloadUiChange } from "util/imagePreload";

type UI_ACTIONS = "SET_VIEW" | "SET_PENDING_VIEW";

export const GRID_VIEW = "books table view";
export const BASIC_LIST_VIEW = "books mobile view";
export const COVERS_LIST = "books covers view";

export interface BookUiState {
  view: string;
  pendingView: string;
  pending: boolean;
}

export function bookUiReducer(state, action: { type: UI_ACTIONS; value: any }): BookUiState {
  switch (action.type) {
    case "SET_VIEW":
      localStorage.set("book-ui", action.value);
      return { ...state, view: action.value, pending: false };
    case "SET_PENDING_VIEW":
      return { ...state, pendingView: action.value, pending: true };
  }
}

export const getBookSearchUiView = () => {
  const bookUiInitialState = {
    view: localStorage.get("book-ui") as any,
    pendingView: localStorage.get("book-ui") as any
  };

  if (!bookUiInitialState.view) {
    bookUiInitialState.view = get(appState).showingDesktop ? GRID_VIEW : BASIC_LIST_VIEW;
  }

  let [uiState, dispatch] = useReducer<BookUiState>(bookUiReducer, bookUiInitialState);

  let currentPreload;
  let requestState = (payload, books) => {
    dispatch(payload);
    let isMedium = payload.value == COVERS_LIST;
    let p = (currentPreload = preloadUiChange(books, isMedium));

    p.then(() => {
      p == currentPreload && dispatch({ ...payload, type: "SET_VIEW" });
    });
  };

  return derived([appState, uiState], ([$appState, $uiState]) => {
    let { view, pendingView, pending } = $uiState;

    return {
      view,
      pendingView,
      pending,

      dispatch,
      requestState
    };
  });
};
