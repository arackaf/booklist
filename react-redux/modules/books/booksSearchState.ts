import shallowEqual from "shallow-equal/objects";

import { setSearchValues, getCurrentHistoryState, history } from "reactStartup";
import { getStatePacket } from "applicationRoot/rootReducer";
import { useContext, useMemo } from "react";
import { SubjectsContext } from "applicationRoot/renderUI";
import { BooksSearchContext, TagsContext, BooksContext } from "./components/bookViewList";
import { AppState } from "applicationRoot/appState";
import { useBookLoadingInfo } from "./booksState";

const SET_GRID_VIEW = "booksSearch.SET_GRID_VIEW";
const SET_BASIC_LIST_VIEW = "booksSearch.SET_BasicList_VIEW";

const GRID_VIEW = "books table view";
const BASIC_LIST_VIEW = "books mobile view";
const HASH_CHANGED = "books search hash changed";

const initialState = {
  view: "",
  hashFilters: {} as typeof defaultSearchValuesHash
};
export type BookSearchState = typeof initialState;

export function bookSearchReducer(state = initialState, action): BookSearchState {
  switch (action.type) {
    case SET_BASIC_LIST_VIEW:
      return { ...state, view: BASIC_LIST_VIEW };
    case SET_GRID_VIEW:
      return { ...state, view: GRID_VIEW };
    case HASH_CHANGED:
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

const defaultSearchValuesHash = {
  search: "",
  subjects: "",
  tags: "",
  searchChildSubjects: "",
  author: "",
  publisher: "",
  pages: "",
  pagesOperator: "",
  page: 1,
  pageSize: 50,
  isRead: "",
  noSubjects: "",
  sort: "_id",
  sortDirection: "desc",
  userId: ""
};

export function useBooksSearchState(): [BookSearchState, any, any] {
  let actions = { setViewDesktop, setViewBasicList, hashChanged };
  return getStatePacket<BookSearchState>(bookSearchReducer, initialState, actions);
}

export const useSelectedSubjects = () => {
  const [{ hashFilters }] = useContext(BooksSearchContext);
  const { subjects } = hashFilters;
  const [{ subjectHash }] = useContext(SubjectsContext);

  return useMemo(() => projectSelectedItems(subjects, subjectHash), [subjects, subjectHash]);
};

export const useSelectedTags = () => {
  const [{ hashFilters }] = useContext(BooksSearchContext);
  const { tags } = hashFilters;
  const [{ tagHash }] = useContext(TagsContext);

  return useMemo(() => projectSelectedItems(tags, tagHash), [tags, tagHash]);
};

function projectSelectedItems(ids: string = "", hash): TagOrSubject[] {
  return ids
    .split("-")
    .map(_id => (_id ? hash[_id] : null))
    .filter(res => res);
}

export const useCurrentSearch = () => {
  const [{ hashFilters: filters }] = useContext(BooksSearchContext);
  const { subjects: subjectsHashValue, tags: tagsHashValue } = filters;

  const subjects = useSelectedSubjects();
  const tags = useSelectedTags();

  return useMemo(
    () =>
      Object.assign({}, defaultSearchValuesHash, filters, {
        selectedSubjects: subjects,
        selectedTags: tags,
        tagIds: tagsHashValue ? tagsHashValue.split("-") : [],
        subjectIds: subjectsHashValue ? subjectsHashValue.split("-") : [],
        anyActiveFilters: !!Object.keys(filters).filter(k => k != "page").length,
        activeFilterCount: Object.keys(filters).filter(k => k != "page").length,
        bindableSortValue: `${filters.sort}|${filters.sortDirection}`
      }),
    [filters, subjects, tags, subjectsHashValue, tagsHashValue]
  );
};

export const useBookSearchUiView = (app: AppState) => {
  let [bookSearch] = useBooksSearchState();

  let view = bookSearch.view;
  let isGridView = view == GRID_VIEW || (!view && app.showingDesktop);
  let isBasicList = view == BASIC_LIST_VIEW || (!view && app.showingMobile);

  return {
    isGridView,
    isBasicList
  };
};

const setViewDesktop = () => ({ type: SET_GRID_VIEW });
const setViewBasicList = () => ({ type: SET_BASIC_LIST_VIEW });

const hashChanged = filters => ({ type: HASH_CHANGED, filters });

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

export const setSortOrder = (sort, sortDirection) => {
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
  let currentSearch = useCurrentSearch();
  let newSubjects = currentSearch.selectedSubjects.map(s => s._id).filter(sId => sId != _id);

  setSearchValues({
    subjects: newSubjects.join("-"),
    searchChildSubjects: currentSearch.searchChildSubjects && newSubjects ? "true" : null
  });
};

export const removeFilterTag = _id => {
  let currentSearch = useCurrentSearch();
  let newTags = currentSearch.selectedTags.map(s => s._id).filter(sId => sId != _id);

  setSearchValues({ tags: newTags.join("-") });
};

export const clearSearchChildSubjects = () => setSearchValues({ searchChildSubjects: null });

export const quickSearch = val => setSearchValues({ page: null, search: val });

export const pageOne = () => {
  setSearchValues({ page: null });
};

export const pageDown = () => {
  let bookSearchFilters = useCurrentSearch();
  setSearchValues({ page: +bookSearchFilters.page == 2 ? null : bookSearchFilters.page - 1 });
};

export const pageUp = () => {
  let bookSearchFilters = useCurrentSearch();
  setSearchValues({ page: +bookSearchFilters.page + 1 });
};

export const pageLast = () => {
  let booksState = useBookLoadingInfo();
  setSearchValues({ page: booksState.totalPages });
};
