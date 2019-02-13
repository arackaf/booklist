import { createSelector } from "reselect";
import shallowEqual from "shallow-equal/objects";

import { BooksModuleType } from "modules/books/reducers/reducer";

import { BOOK_SEARCH_VERSION_KEY, getSearchVersion } from "applicationRoot/rootReducer";

const SET_GRID_VIEW = "booksSearch.SET_GRID_VIEW";
const SET_BASIC_LIST_VIEW = "booksSearch.SET_BasicList_VIEW";

const GRID_VIEW = "books table view";
const BASIC_LIST_VIEW = "books mobile view";
const HASH_CHANGED = "books search hash changed";

const initialState = {
  view: "",
  hashFilters: {} as typeof defaultSearchValuesHash
};
export type BookSearchType = typeof initialState;

export function bookSearchReducer(state = initialState, action): BookSearchType {
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

export const selectSelectedSubjects = createSelector(
  (state: BooksModuleType) => state.booksModule.bookSearch,
  (state: BooksModuleType) => state.app.subjectHash,
  (filters, hash) => projectSelectedItems(filters.hashFilters.subjects, hash)
);

export const selectSelectedTags = createSelector(
  (state: BooksModuleType) => state.booksModule.bookSearch,
  (state: BooksModuleType) => state.app.tagHash,
  (filters, hash) => {
    return projectSelectedItems(filters.hashFilters.tags, hash);
  }
);

function projectSelectedItems(ids: string = "", hash): TagOrSubject[] {
  return ids
    .split("-")
    .map(_id => (_id ? hash[_id] : null))
    .filter(res => res);
}

export const selectCurrentSearch = createSelector(
  (state: BooksModuleType) => state.booksModule.bookSearch,
  selectSelectedSubjects,
  selectSelectedTags,
  (bookSearch, subjects, tags) => {
    let filters = bookSearch.hashFilters;
    let tagsHashValue = bookSearch.hashFilters.tags;
    let subjectsHashValue = bookSearch.hashFilters.subjects;

    return Object.assign({}, defaultSearchValuesHash, filters, {
      selectedSubjects: subjects,
      selectedTags: tags,
      tagIds: tagsHashValue ? tagsHashValue.split("-") : [],
      subjectIds: subjectsHashValue ? subjectsHashValue.split("-") : []
    });
  }
);

export const selectBookSearchState = createSelector(
  selectCurrentSearch,
  (state: BooksModuleType) => state.booksModule.bookSearch,
  (currentSearch, bookSearch) => {
    let filtersHash = { ...bookSearch.hashFilters };
    delete filtersHash.sort;
    delete filtersHash.sortDirection;
    delete filtersHash.userId;
    return {
      ...currentSearch,
      anyActiveFilters: !!Object.keys(filtersHash).filter(k => k != "page").length,
      activeFilterCount: Object.keys(filtersHash).filter(k => k != "page").length,
      bindableSortValue: `${currentSearch.sort}|${currentSearch.sortDirection}`
    };
  }
);

export const selectBookSearchUiView = createSelector(
  (state: BooksModuleType) => state.app,
  (state: BooksModuleType) => state.booksModule.bookSearch,
  (app, bookSearch) => {
    let view = bookSearch.view,
      isGridView = view == GRID_VIEW || (!view && app.showingDesktop),
      isBasicList = view == BASIC_LIST_VIEW || (!view && app.showingMobile);

    return {
      isGridView,
      isBasicList
    };
  }
);
