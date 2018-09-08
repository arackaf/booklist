import { createSelector } from "reselect";
import { SET_SEARCH_VALUES, SEARCH_BOOKS, SEARCH_BOOKS_COMPLETE } from "./actionNames";

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
  search: "",
  subjects: [] as string[],
  tags: [] as string[],
  searchResults: [] as IBookRaw[],
  searching: false,
  resultsCount: 0
};
export type RecommendReducerType = typeof initialSearchState;

export function searchReducer(state = initialSearchState, action): RecommendReducerType {
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
