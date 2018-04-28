import { store } from "applicationRoot/store";
import { BEGIN_FILTER_CHANGE, END_FILTER_CHANGE, SET_GRID_VIEW, SET_BASIC_LIST_VIEW, GRID_VIEW, BASIC_LIST_VIEW, HASH_CHANGED } from "./actionNames";

import { loadBooks } from "../books/actionCreators";
import { loadSubjects } from "applicationRoot/rootReducerActionCreators";
import { loadTags } from "../tags/actionCreators";

import { setSearchValues, getCurrentHistoryState, history } from "reactStartup";

export const setViewDesktop = view => ({ type: SET_GRID_VIEW });
export const setViewBasicList = view => ({ type: SET_BASIC_LIST_VIEW });

export const hashChanged = filters => ({ type: HASH_CHANGED, filters });

export function beginFilterChange() {
  return { type: BEGIN_FILTER_CHANGE };
}

export function endFilterChanging() {
  return { type: END_FILTER_CHANGE };
}

export function applyFilters(nextState: any) {
  return function(dispatch, getState) {
    let filterSubjectsVal = nextState.subjects.join("-");

    setSearchValues({
      page: null,
      search: nextState.search,
      subjects: filterSubjectsVal,
      tags: nextState.tags.join("-"),
      searchChildSubjects: nextState.searchChildSubjects && filterSubjectsVal ? "true" : null,
      author: nextState.author,
      publisher: nextState.publisher,
      pagesOperator: nextState.pages != "" ? nextState.pagesOperator : null,
      pages: nextState.pages,
      isRead: nextState.isRead,
      noSubjects: nextState.noSubjects ? "true" : ""
    });
    dispatch(endFilterChanging());
  };
}

export function clearAllFilters() {
  return function(dispatch, getState) {
    setSearchValues({
      page: null,
      search: "",
      subjects: "",
      tags: "",
      searchChildSubjects: null,
      author: "",
      publisher: "",
      pagesOperator: null,
      pages: "",
      isRead: "",
      noSubjects: ""
    });
  };
}

export function setSortOrder(sort, direction) {
  return function(dispatch, getState) {
    setSearchValues({
      sort: sort,
      sortDirection: direction == 1 ? "asc" : "desc",
      page: null
    });
  };
}

export function booksInitialized({ priorState }) {
  let isActive = true;
  let reactivating = false;
  history.listen((location, action) => {
    const { pathname, searchState } = getCurrentHistoryState();
    let nowActive = pathname === "/books" || pathname === "/view";
    reactivating = !isActive && nowActive;
    isActive = nowActive;

    if (isActive) {
      store.dispatch(hashChanged(searchState));
    }
  });
  store.dispatch(hashChanged(getCurrentHistoryState().searchState));
  let lastSearchState = (store.getState() as any).booksModule.bookSearch.hashFilters;

  store.subscribe(() => {
    if (!isActive) return;

    let booksModuleState = (store.getState() as any).booksModule;
    let { reloadOnActivate } = booksModuleState.books;
    let newSearchState = booksModuleState.bookSearch.hashFilters;
    let isReactivating = reactivating;
    reactivating = false; //reset this immediately, before any dispatches

    if (newSearchState !== lastSearchState || (reloadOnActivate && isReactivating)) {
      lastSearchState = newSearchState;
      store.dispatch(loadBooks());
    }
  });

  return function(dispatch, getState) {
    if (!priorState.booksModule) {
      dispatch(loadSubjects());
      dispatch(loadTags());
      dispatch(loadBooks());
    }
  };
}

export function removeFilterSubject(_id) {
  return function(dispatch, getState) {
    let state = getState().booksModule.bookSearch,
      newSubjects = Object.keys(state.subjects)
        .filter(sId => sId != _id)
        .join("-");

    setSearchValues({
      subjects: newSubjects,
      searchChildSubjects: state.searchChildSubjects && newSubjects ? "true" : null
    });
  };
}

export function removeFilterTag(_id) {
  return function(dispatch, getState) {
    let state = getState().booksModule.bookSearch,
      newTags = Object.keys(state.tags)
        .filter(sId => sId != _id)
        .join("-");

    setSearchValues({ tags: newTags });
  };
}

export function clearSearchChildSubjects() {
  return function(dispatch, getState) {
    setSearchValues({ searchChildSubjects: null });
  };
}

export function quickSearch(val) {
  return function(dispatch, getState) {
    let state = getState().booksModule.bookSearch;
    setSearchValues({
      page: null,
      search: val
    });
  };
}

export function pageUp() {
  return function(dispatch, getState) {
    let state = getState().booksModule.bookSearch;
    setSearchValues({ page: +state.page + 1 });
  };
}

export function pageDown() {
  return function(dispatch, getState) {
    let state = getState().booksModule.bookSearch;
    setSearchValues({ page: +state.page == 2 ? null : state.page - 1 });
  };
}
