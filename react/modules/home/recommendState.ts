const LOAD_RECOMMENDATIONS = "home.recommend.LOAD_RECOMMENDATIONS";
const LOAD_RECOMMENDATIONS_COMPLETE = "home.recommend.LOAD_RECOMMENDATIONS_COMPLETE";

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
  selectedBooksToSearchAgainst: [] as any,
  searchResults: [] as IBookRaw[],
  searching: false
};
export type RecommendReducerType = typeof initialBooksState;

export function recommendReducer(state = initialBooksState, action): RecommendReducerType {
  switch (action.type) {
    case LOAD_RECOMMENDATIONS:
      return { ...state, searching: true };
    case LOAD_RECOMMENDATIONS:
      return { ...state, searching: true };
    case LOAD_RECOMMENDATIONS_COMPLETE:
      return { ...state, searching: false, searchResults: action.searchResults };
  }
  return state;
}
