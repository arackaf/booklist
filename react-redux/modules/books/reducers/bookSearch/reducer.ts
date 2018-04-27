import { BooksModuleType, AppType, bookSearchType, TagsType } from "modules/books/reducers/reducer";

import {
  HASH_CHANGED,
  BEGIN_FILTER_CHANGE,
  END_FILTER_CHANGE,
  SET_VIEWING_USERID,
  SET_GRID_VIEW,
  SET_BASIC_LIST_VIEW,
  GRID_VIEW,
  BASIC_LIST_VIEW
} from "./actionNames";

import shallowEqual from "shallow-equal/objects";

import { BOOK_SAVED, MANUAL_BOOK_SAVED } from "modules/scan/reducers/actionNames";

import { LOAD_BOOKS_RESULTS, EDITING_BOOK_SAVED, BOOK_READ_CHANGED, BOOK_DELETED, SET_BOOKS_SUBJECTS, SET_BOOKS_TAGS } from "../books/actionNames";
import { createSelector } from "reselect";

import { selectStackedSubjects, StackedSubjectsType, filterSubjects as filterSubjectsOrTags } from "../subjects/reducer";
import { selectEntireTagsState, TagsStateType } from "../tags/reducer";

const searchFields = {
  search: "",
  subjects: {},
  tags: {},
  searchChildSubjects: false,
  author: "",
  publisher: "",
  pages: "",
  pagesOperator: "lt",
  page: 1,
  pageSize: 50,
  isRead: "",
  noSubjects: ""
};
export type searchFieldsType = typeof searchFields;

const initialState = {
  editingFilters: false,
  hasMore: false,
  view: "",
  searchVersion: +new Date(),
  hashFilters: {}
};
export type bookSearchType = typeof initialState;

export function bookSearchReducer(state = initialState, action): bookSearchType {
  switch (action.type) {
    case BEGIN_FILTER_CHANGE:
      return { ...state, editingFilters: true };
    case END_FILTER_CHANGE:
      return Object.assign({}, state, { editingFilters: false });
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

function projectSelectedItems(ids, hash) {
  return Object.keys(ids)
    .filter(k => ids[k])
    .map(_id => hash[_id])
    .filter(s => s);
}

type lookupHashType = {
  [str: string]: tagOrSubject;
};
type tagOrSubject = {
  _id: string;
  name: string;
};

const createMemoizedPSI = (getActiveIds: ((state: BooksModuleType) => lookupHashType), getLookupHash: ((state: BooksModuleType) => lookupHashType)) =>
  createSelector<BooksModuleType, tagOrSubject[], lookupHashType, lookupHashType>(getActiveIds, getLookupHash, (ids, hash) =>
    projectSelectedItems(ids, hash)
  );

const selectSelectedSubjects = createMemoizedPSI(state => state.booksModule.bookSearch.subjects, state => state.app.subjectHash);
const selectSelectedTags = createMemoizedPSI(state => state.booksModule.bookSearch.tags, state => state.booksModule.tags.tagHash);

export type BookSearchUiViewType = {
  isGridView: boolean;
  isBasicList: boolean;
};
export const selectBookSearchUiView = createSelector<BooksModuleType, BookSearchUiViewType, AppType, bookSearchType>(
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

export type entireBookSearchStateType = bookSearchType &
  BookSearchUiViewType & {
    allTagsSorted: tagOrSubject[];
    selectedSubjects: tagOrSubject[];
    subjectsUnwound: tagOrSubject[];
    selectedTags: tagOrSubject[];
    bindableSortValue: any;
    anyActiveFilters: boolean;
    subjectHash: any;
    tagHash: any;
  };
export const selectEntireBookSearchState = createSelector<
  BooksModuleType,
  entireBookSearchStateType,
  TagsStateType,
  StackedSubjectsType,
  bookSearchType,
  BookSearchUiViewType
>(
  selectEntireTagsState,
  selectStackedSubjects,
  //selectSelectedSubjects,
  //selectSelectedTags,
  state => state.booksModule.bookSearch,
  selectBookSearchUiView,
  (tagsState, subjectsState, /*selectedSubjects, selectedTags,*/ bookSearch, searchUi) => {
    //let bindableSortValue = !bookSearch.sort ? "_id|desc" : `${bookSearch.sort}|${bookSearch.sortDirection == "1" ? "asc" : "desc"}`;

    //let filtersToCheckAgainstDefault = ["search", "author", "publisher", "pages", "isRead"];
    //let anyActiveFilters = filtersToCheckAgainstDefault.find(k => bookSearch[k] != initialState[k]); //||
    //!!bookSearch.searchChildSubjects != !!initialState.searchChildSubjects ||
    //Object.keys(bookSearch.tags).length ||
    //Object.keys(bookSearch.subjects).length;

    return {
      ...bookSearch,
      tagHash: tagsState.tagHash,
      subjectHash: subjectsState.subjectHash,
      subjectsUnwound: subjectsState.subjectsUnwound,
      allTagsSorted: tagsState.allTagsSorted,
      anyActiveFilters: false,
      selectedSubjects: [],
      selectedTags: [],
      bindableSortValue: "_id",
      ...searchUi
    };
  }
);
