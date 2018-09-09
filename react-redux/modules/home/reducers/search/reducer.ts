import { createSelector } from "reselect";
import { SET_SEARCH_VALUES, SEARCH_BOOKS, SEARCH_BOOKS_COMPLETE } from "./actionNames";
import { HomeType } from "../reducer";

interface IBookRaw {
  _id: string;
  isRead: boolean;
  isbn: string;
  smallImage: string;
  authors: string[];
  subjects: string[];
  tags: string[];
  title: string;
}

const initialSearchState = {
  title: "",
  isRead: "",
  subjects: [] as string[],
  searchChildSubjects: false,
  tags: [] as string[],
  searchResults: [] as IBookRaw[],
  searching: false,
  resultsCount: 0
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
  }
  return state;
}

export const selectSearchVals = createSelector(
  (state: HomeType) => state.homeModule.search,
  search => ({
    title: search.title,
    isRead: search.isRead,
    selectedSubjects: search.subjects,
    selectedTags: search.tags,
    searchChildSubjects: search.searchChildSubjects
  })
);
