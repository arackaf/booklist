import { createSelector } from "reselect";
import shallowEqual from "shallow-equal/objects";

import { BooksModuleType, AppType, BookSearchType, TagsType } from "modules/books/reducers/reducer";
import { HASH_CHANGED, SET_GRID_VIEW, SET_BASIC_LIST_VIEW, GRID_VIEW, BASIC_LIST_VIEW } from "./actionNames";
import { BOOK_SAVED, MANUAL_BOOK_SAVED } from "modules/scan/reducers/actionNames";
import { LOAD_BOOKS_RESULTS, EDITING_BOOK_SAVED, BOOK_READ_CHANGED, BOOK_DELETED, SET_BOOKS_SUBJECTS, SET_BOOKS_TAGS } from "../books/actionNames";

const initialState = {
  hasMore: false,
  view: "",
  searchVersion: +new Date(),
  hashFilters: {} as BookSearchValues
};
export type BookSearchType = typeof initialState;

export function bookSearchReducer(state = initialState, action): BookSearchType {
  switch (action.type) {
    case LOAD_BOOKS_RESULTS:
      return Object.assign({}, state, { hasMore: action.hasMore });
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
    case BOOK_SAVED:
    case BOOK_READ_CHANGED:
    case BOOK_DELETED:
    case MANUAL_BOOK_SAVED:
    case EDITING_BOOK_SAVED:
    case SET_BOOKS_SUBJECTS:
    case SET_BOOKS_TAGS:
      return { ...state, searchVersion: +new Date() };
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
  sortDirection: "desc"
};
export type BookSearchValues = typeof defaultSearchValuesHash & {
  selectedSubjects: TagOrSubject[];
  selectedTags: TagOrSubject[];
  tagIds: string[];
};
export type BookSearchState = BookSearchValues & {
  anyActiveFilters: boolean;
  bindableSortValue: string;
};

export const selectSelectedSubjects = createSelector<any, any, BookSearchType, LookupHashType>(
  state => state.booksModule.bookSearch,
  state => state.app.subjectHash,
  (filters, hash) => projectSelectedItems(filters.hashFilters.subjects, hash)
);

export const selectSelectedTags = createSelector<any, any, BookSearchType, LookupHashType>(
  state => state.booksModule.bookSearch,
  state => state.booksModule.tags.tagHash,
  (filters, hash) => {
    return projectSelectedItems(filters.hashFilters.tags, hash);
  }
);

function projectSelectedItems(ids: string = "", hash) {
  return ids
    .split("-")
    .map(_id => (_id ? hash[_id] : null))
    .filter(res => res);
}

export const selectCurrentSearch = createSelector<BooksModuleType, BookSearchValues, BookSearchType, TagOrSubject[], TagOrSubject[]>(
  state => state.booksModule.bookSearch,
  selectSelectedSubjects,
  selectSelectedTags,
  (bookSearch, subjects, tags) => {
    let filters = bookSearch.hashFilters;
    let tagsHashValue = bookSearch.hashFilters.tags;
    return Object.assign({}, defaultSearchValuesHash, filters, {
      selectedSubjects: subjects,
      selectedTags: tags,
      tagIds: tagsHashValue ? tagsHashValue.split(",") : []
    });
  }
);

export const selectBookSearchState = createSelector<BooksModuleType, BookSearchState, BookSearchValues, BookSearchType>(
  selectCurrentSearch,
  state => state.booksModule.bookSearch,
  (currentSearch, bookSearch) => ({
    ...currentSearch,
    anyActiveFilters: !!Object.keys(bookSearch.hashFilters).length,
    bindableSortValue: `${currentSearch.sort}|${currentSearch.sortDirection}`
  })
);

export type BookSearchUiViewType = {
  isGridView: boolean;
  isBasicList: boolean;
};
export const selectBookSearchUiView = createSelector<BooksModuleType, BookSearchUiViewType, AppType, BookSearchType>(
  state => state.app,
  state => state.booksModule.bookSearch,
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
