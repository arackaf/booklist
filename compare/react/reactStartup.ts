import "./static/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./site-styles.css";

import { renderUI } from "app/renderUI";
import { createElement } from "react";
import queryString from "query-string";
export type MutationType = { runMutation: any; dispatch: any; running: any };
import "util/ajaxUtil";
import createHistory from "history/createBrowserHistory";

export const history = createHistory();

renderUI();

export function loadCurrentModule() {
  let modulePromise = import(/* webpackChunkName: "books-module" */ "./modules/books/books");

  Promise.all([modulePromise])
    .then(([{ default: ModuleComponent }]) => {
      renderUI(createElement(ModuleComponent));
    })
    .catch(() => {});
}

export function getCurrentHistoryState() {
  let location = history.location;
  return {
    searchState: queryString.parse(location.search)
  };
}

export function setSearchValues(state) {
  let { searchState: existingSearchState } = getCurrentHistoryState();
  let newState = { ...existingSearchState, ...state };
  newState = Object.keys(newState)
    .filter(k => newState[k])
    .reduce((hash, prop) => ((hash[prop] = newState[prop]), hash), {});

  history.push({
    search: queryString.stringify(newState)
  });
}
