import shallowEqual from "shallow-equal/objects";

import { setSearchValues, getCurrentHistoryState, history } from "reactStartup";
import { useContext, useMemo, useEffect, useReducer } from "react";
import { SubjectsContext, AppContext } from "app/renderUI";
import { TagsContext } from "app/tagsState";

import localStorage from "util/localStorage";
import { defaultSearchValuesHash, filtersFromUrl } from "./booksLoadingUtils";

type UI_ACTIONS = "SET_GRID_VIEW" | "SET_BASIC_LIST_VIEW" | "SET_COVERS_LIST_VIEW";

const GRID_VIEW = "books table view";
const BASIC_LIST_VIEW = "books mobile view";
const COVERS_LIST = "books covers view";

const bookSearchInitialState = {
  hashFilters: {} as typeof defaultSearchValuesHash
};
export type BookSearchState = typeof bookSearchInitialState;

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
export function bookSearchReducer(state = bookSearchInitialState, action): BookSearchState {
  switch (action.type) {
    case "HASH_CHANGED":
      let { filters } = action;
      if (!shallowEqual(filters, state.hashFilters)) {
        return { ...state, hashFilters: filters };
      }
      return { ...state };
  }
  return state;
}

export type TagOrSubject = {
  _id: string;
  name: string;
};
export type LookupHashType = {
  [str: string]: TagOrSubject;
};

export function useBooksSearchState(): [BookSearchState, any] {
  let initialSearchState = useMemo(() => ({ ...bookSearchInitialState, hashFilters: getCurrentHistoryState().searchState }), []);
  let [result, dispatch] = useReducer(bookSearchReducer, initialSearchState);

  useEffect(() => {
    return history.listen(() => {
      const { searchState } = getCurrentHistoryState();
      dispatch({ type: "HASH_CHANGED", filters: searchState });
    });
  }, [dispatch]);

  return [result, dispatch];
}

export const useSelectedSubjects = () => {
  const [{ hashFilters }] = useBooksSearchState();
  const { subjects } = hashFilters;
  const { subjectHash } = useContext(SubjectsContext);

  return useMemo(() => projectSelectedItems(subjects, subjectHash), [subjects, subjectHash]);
};

export const useSelectedTags = () => {
  const [{ hashFilters }] = useBooksSearchState();
  const { tags } = hashFilters;
  const { tagHash } = useContext(TagsContext);

  return useMemo(() => projectSelectedItems(tags, tagHash), [tags, tagHash]);
};

function projectSelectedItems(ids: string = "", hash): TagOrSubject[] {
  return ids
    .split("-")
    .map(_id => (_id ? hash[_id] : null))
    .filter(res => res);
}

const keyIsFilter = k => k != "page" && k != "sort" && k != "sortDirection" && k != "userId";

export const useCurrentSearch = () => {
  const [{ hashFilters: filters }] = useBooksSearchState();
  const { subjects: subjectsHashValue, tags: tagsHashValue } = filters;

  const subjects = useSelectedSubjects();
  const tags = useSelectedTags();

  return useMemo(() => {
    let result = Object.assign({}, filtersFromUrl(filters), {
      selectedSubjects: subjects,
      selectedTags: tags
    });

    return Object.assign({}, result, {
      anyActiveFilters: !!Object.keys(filters).filter(keyIsFilter).length,
      activeFilterCount: Object.keys(filters).filter(keyIsFilter).length,
      bindableSortValue: `${result.sort}|${result.sortDirection}`
    });
  }, [filters, subjects, tags, subjectsHashValue, tagsHashValue]);
};

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

export const applyFilters = (nextState: any) => {
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
    noSubjects: nextState.noSubjects ? "true" : "",
    sort: nextState.sort,
    sortDirection: nextState.sortDirection
  });
};

export const clearAllFilters = () => {
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

export const setBooksSort = (sort, sortDirection) => {
  if (sort == "_id" && sortDirection == "desc") {
    setSearchValues({
      sort: "",
      sortDirection: "",
      page: null
    });
  } else {
    setSearchValues({
      sort: sort,
      sortDirection,
      page: null
    });
  }
};

export const removeFilters = (...names) => {
  setSearchValues(names.concat("page").reduce((hash, item) => ((hash[item] = ""), hash), {}));
};

export const removeFilterSubject = _id => {
  let hashFilters = getCurrentHistoryState().searchState;
  let existingSubjects = hashFilters.subjects.split("-").filter(s => s);
  let newSubjects = existingSubjects.filter(sId => sId != _id);
  let newFilters: any = {
    subjects: newSubjects.join("-")
  };
  if (!newSubjects.length) {
    newFilters.searchChildSubjects = null;
  }

  setSearchValues(newFilters);
};

export const removeFilterTag = _id => {
  let hashFilters = getCurrentHistoryState().searchState;
  let existingTags = hashFilters.tags.split("-").filter(t => t);

  let newTags = existingTags.filter(tId => tId != _id);

  setSearchValues({ tags: newTags.join("-") });
};

export const clearSearchChildSubjects = () => setSearchValues({ searchChildSubjects: null });

export const quickSearch = val => setSearchValues({ page: null, search: val });

export const pageOne = () => {
  setSearchValues({ page: null });
};

export const setPage = page => setSearchValues({ page: page == 1 ? null : page });
