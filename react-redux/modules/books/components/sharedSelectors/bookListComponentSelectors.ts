import { createSelector } from "reselect";
import { selectBookSelection, selectBookList, IBookRaw } from "modules/books/reducers/books/reducer";

import * as actionCreatorsBooks from "modules/books/reducers/books/actionCreators";
import * as actionCreatorsBookSearch from "modules/books/reducers/bookSearch/actionCreators";
import { selectCurrentSearch } from "modules/books/reducers/bookSearch/reducer";
import { BooksModuleType } from "../../reducers/reducer";

export const actions = {
  ...actionCreatorsBooks,
  ...actionCreatorsBookSearch
};

export type actionsType = typeof actionCreatorsBooks & typeof actionCreatorsBookSearch;

export const selectBookListComponentState = createSelector(
  (state: BooksModuleType) => state.app,
  (state: BooksModuleType) => state.booksModule.books,
  (state: BooksModuleType) => state.booksModule.bookSearch,
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
