import ajaxUtil from "util/ajaxUtil";
import { ISearchBookRaw } from "./searchState";

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
  selectedBooksToSearchAgainst: [] as ISearchBookRaw[],
  searchResults: [] as IBookRaw[],
  searching: false
};
export type RecommendReducerType = typeof initialBooksState;

export function recommendReducer(state = initialBooksState, action): RecommendReducerType {
  switch (action.type) {
    case LOAD_RECOMMENDATIONS:
      return { ...state, searching: true };
    // case SELECT_BOOK_TO_SEARCH_RECOMMENDATIONS_FOR:
    //   return { ...state, selectedBooksToSearchAgainst: [...state.selectedBooksToSearchAgainst, action.book] };
    // case REMOVE_SELECTED_BOOK:
    //   return { ...state, selectedBooksToSearchAgainst: state.selectedBooksToSearchAgainst.filter(b => b !== action.book) };
    case LOAD_RECOMMENDATIONS:
      return { ...state, searching: true };
    case LOAD_RECOMMENDATIONS_COMPLETE:
      return { ...state, searching: false, searchResults: action.searchResults };
  }
  return state;
}

// export const selectSelectedBooks = createSelector(
//   (state: HomeType) => state.homeModule.recommend.selectedBooksToSearchAgainst,
//   selectedBooks => ({ selectedBooks })
// );

// export const selectSelectedBookIds = createSelector(
//   (state: HomeType) => state.homeModule.recommend.selectedBooksToSearchAgainst,
//   selectedBooks => [...new Set([...selectedBooks.map(b => b._id)])]
// );

// export const selectRecommendations = createSelector(
//   (state: HomeType) => state.homeModule.recommend.searchResults,
//   (state: HomeType) => state.homeModule.recommend.searching,
//   (recommendations, recommendationsSearching) => ({ recommendations, recommendationsSearching })
// );

// export const findRecommendations = () => (dispatch, getState) => {
//   dispatch({ type: LOAD_RECOMMENDATIONS });
//   let bookIds = selectSelectedBookIds(getState());
//   ajaxUtil.post("/book/getRecommendations", { bookIds }).then(resp => {
//     dispatch({ type: LOAD_RECOMMENDATIONS_COMPLETE, searchResults: resp.results });
//   });
// };
