import { graphqlClient } from "util/graphql";
import { getStatePacket } from "util/stateManagementHelpers";
import GetBooksQuery from "graphQL/home/searchBooks.graphql";
import { createContext, useContext } from "react";

const SET_SEARCH_VALUES = "home.search.SET_SEARCH";
const SEARCH_BOOKS = "home.search.SEARCH_BOOKS";
const SEARCH_BOOKS_COMPLETE = "home.search.SEARCH_BOOKS_COMPLETE";

const SELECT_BOOK_TO_SEARCH_RECOMMENDATIONS_FOR = "home.SELECT_BOOK_TO_SEARCH_RECOMMENDATIONS_FOR";
const REMOVE_SELECTED_BOOK = "home.REMOVE_SELECTED_BOOK";

export interface ISearchBookRaw {
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
type SearchType = typeof initialSearchState;

function searchReducer(state = initialSearchState, action) {
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

export const SearchContext = createContext<[SearchType, any, any]>(null);

export function useSearchState(): [SearchType, any, any] {
  let actions = { booksSearch, selectBookToSearchRecommendationsFor, removeSelectedBook };
  return getStatePacket<SearchType>(searchReducer, initialSearchState, actions);
}

const getSearchVariables = search => {
  return {
    page: search.page,
    pageSize: search.pageSize,
    title: search.title || void 0,
    isRead: search.isRead == "1" ? 1 : void 0,
    isRead_ne: search.isRead == "0" ? 1 : void 0,
    subjects: search.subjects.length ? search.subjects : void 0,
    tags: search.tags.length ? search.tags : void 0,
    searchChildSubjects: search.searchChildSubjects
  };
};

// ACTIONS

const booksSearch = search => dispatch => {
  dispatch({ type: SET_SEARCH_VALUES, values: { ...search, page: 1 } });
  let queryVariables = { ...getSearchVariables(search) };

  dispatch({ type: SEARCH_BOOKS });

  return graphqlClient.runQuery(GetBooksQuery, queryVariables).then(resp => {
    if (resp.data && resp.data.allBooks && resp.data.allBooks.Books && resp.data.allBooks.Meta) {
      dispatch({ type: SEARCH_BOOKS_COMPLETE, results: resp.data.allBooks.Books, count: resp.data.allBooks.Meta.count });
    }
  });
};

const selectBookToSearchRecommendationsFor = book => dispatch => {
  dispatch({ type: SELECT_BOOK_TO_SEARCH_RECOMMENDATIONS_FOR, book });
};

const removeSelectedBook = book => dispatch => {
  dispatch({ type: REMOVE_SELECTED_BOOK, book });
};
