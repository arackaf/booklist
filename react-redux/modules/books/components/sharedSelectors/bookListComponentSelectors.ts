import { createSelector } from "reselect";
import { selectBookSelection, BookSelectionType, selectBookList, BookListType } from "modules/books/reducers/books/reducer";

import * as actionCreatorsBooks from "modules/books/reducers/books/actionCreators";
import * as actionCreatorsBookSearch from "modules/books/reducers/bookSearch/actionCreators";
import { selectCurrentSearch } from "modules/books/reducers/bookSearch/reducer";

export const actions = {
  ...actionCreatorsBooks,
  ...actionCreatorsBookSearch
};

export type actionsType = typeof actionCreatorsBooks & typeof actionCreatorsBookSearch;

export type BookListComponentStateType = BookSelectionType &
  BookListType & {
    viewingPublic: boolean;
    selectedBooks: { [s: string]: any };
    hasMoreBooks: boolean;
    currentPage: string | number;
    currentSort: string;
    sortDirection: string;
  };
export const selectBookListComponentState = createSelector<any, BookListComponentStateType, any, any, any, any, BookListType, BookSelectionType>(
  state => state.app,
  state => state.booksModule.books,
  state => state.booksModule.bookSearch,
  selectCurrentSearch,
  selectBookList,
  selectBookSelection,
  (app, books, bookSearch, bookSearchFilters, bookListSelected, bookSelectionSelected) => {
    return {
      viewingPublic: app.isPublic,

      ...bookListSelected,
      ...bookSelectionSelected,
      selectedBooks: books.selectedBooks,

      hasMoreBooks: bookSearch.hasMore,
      currentPage: bookSearchFilters.page,
      currentSort: bookSearchFilters.sort,
      sortDirection: bookSearchFilters.sortDirection
    };
  }
);
