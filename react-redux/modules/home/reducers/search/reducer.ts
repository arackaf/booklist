import { createSelector } from "reselect";
import { SET_SEARCH_VALUES, SEARCH_BOOKS, SEARCH_BOOKS_COMPLETE, SELECT_BOOK_TO_SEARCH_RECOMMENDATIONS_FOR } from "./actionNames";
import { HomeType, ISearchBookRaw } from "../reducer";

const initialSearchState = {
  page: 1,
  pageSize: 50,
  title: "",
  isRead: "",
  subjects: [] as string[],
  searchChildSubjects: false,
  tags: [] as string[],
  searchResults: [] as ISearchBookRaw[],
  searching: false,
  resultsCount: null
};
export type SearchReducerType = typeof initialSearchState;

export function searchReducer(state = initialSearchState, action): SearchReducerType {
  switch (action.type) {
    case SET_SEARCH_VALUES:
      return { ...state, ...action.values };
    case SEARCH_BOOKS:
      return { ...state, searching: true };
    case SEARCH_BOOKS_COMPLETE:
      return { ...state, searching: false, searchResults: action.results, resultsCount: action.count };
    case SELECT_BOOK_TO_SEARCH_RECOMMENDATIONS_FOR:
      return { ...state, searchResults: state.searchResults.filter(b => b !== action.book) };
  }
  return state;
}

export const selectSearchVals = createSelector(
  (state: HomeType) => state.homeModule.search,
  search => ({
    page: search.page,
    pageSize: search.pageSize,
    title: search.title,
    isRead: search.isRead,
    subjects: search.subjects,
    tags: search.tags,
    searchChildSubjects: search.searchChildSubjects
  })
);

export const selectSearchStatus = createSelector(
  (state: HomeType) => state.homeModule.search,
  search => ({
    searching: search.searching,
    searchResults: search.searchResults,
    resultsCount: search.resultsCount
  })
);

export const selectSearchVariables = createSelector(
  (state: HomeType) => state.homeModule.search,
  search => ({
    page: search.page,
    pageSize: search.pageSize,
    title: search.title || void 0,
    isRead: search.isRead == "1" ? 1 : void 0,
    isRead_ne: search.isRead == "0" ? 1 : void 0,
    subjects: search.subjects.length ? search.subjects : void 0,
    tags: search.tags.length ? search.tags : void 0,
    searchChildSubjects: search.searchChildSubjects
  })
);
