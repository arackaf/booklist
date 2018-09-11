import { createSelector } from "reselect";
import { LOAD_RECOMMENDATIONS } from "./actionNames";
import { ISearchBookRaw, HomeType } from "../reducer";
import { SELECT_BOOK_TO_SEARCH_RECOMMENDATIONS_FOR, REMOVE_SELECTED_BOOK } from "../search/actionNames";

export interface IBookRaw {
  _id: string;
  isRead: boolean;
  isbn: string;
  smallImage: string;
  authors: string[];
  subjects: string[];
  tags: string[];
  title: string;
}

const initialBooksState = {
  selectedBooksToSearchAgainst: [] as ISearchBookRaw[],
  searchResults: [] as IBookRaw[],
  searching: false,
  resultsCount: 0
};
export type RecommendReducerType = typeof initialBooksState;

export function recommendReducer(state = initialBooksState, action): RecommendReducerType {
  switch (action.type) {
    case LOAD_RECOMMENDATIONS:
      return { ...state, searching: true };
    case SELECT_BOOK_TO_SEARCH_RECOMMENDATIONS_FOR:
      return { ...state, selectedBooksToSearchAgainst: [...state.selectedBooksToSearchAgainst, action.book] };
    case REMOVE_SELECTED_BOOK:
      return { ...state, selectedBooksToSearchAgainst: state.selectedBooksToSearchAgainst.filter(b => b !== action.book) };
  }
  return state;
}

export const selectSelectedBooksToSearchAgainst = createSelector(
  (state: HomeType) => state.homeModule.recommend.selectedBooksToSearchAgainst,
  selectedBooks => ({ selectedBooks })
);
