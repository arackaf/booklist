import { createSelector } from "reselect";
import { LOAD_RECOMMENDATIONS } from "./actionNames";

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
  searchResults: [] as IBookRaw[],
  searching: false,
  resultsCount: 0
};
export type RecommendReducerType = typeof initialBooksState;

export function recommendReducer(state = initialBooksState, action): RecommendReducerType {
  switch (action.type) {
    case LOAD_RECOMMENDATIONS:
      return { ...state, searching: true };
  }
  return state;
}
