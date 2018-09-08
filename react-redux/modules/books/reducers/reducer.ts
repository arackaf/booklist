import { AppType } from "applicationRoot/rootReducer";
import { combineReducers } from "redux";
import { booksReducer as books, BooksReducerType } from "./books/reducer";
import { bookSearchReducer as bookSearch, BookSearchType } from "./bookSearch/reducer";

export { AppType };
export { BooksReducerType };
export { BookSearchType };

export type BooksModuleType = {
  app: AppType;
  booksModule: {
    books: BooksReducerType;
    bookSearch: BookSearchType;
  };
};

export const reducer = combineReducers({
  books,
  bookSearch
});
