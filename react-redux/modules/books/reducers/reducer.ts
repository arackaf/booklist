import { AppType } from "applicationRoot/rootReducer";
import { combineReducers } from "redux";
import { booksReducer as books, BooksReducerType } from "./books/reducer";
import { tagsReducer as tags, TagsType } from "./tags/reducer";
import { bookSearchReducer as bookSearch, bookSearchType } from "./bookSearch/reducer";

export { AppType };
export { BooksReducerType };
export { bookSearchType };
export { TagsType };

export type BooksModuleType = {
  app: AppType;
  booksModule: {
    books: BooksReducerType;
    bookSearch: bookSearchType;
    tags: TagsType;
  };
};

export const reducer = combineReducers({
  books,
  bookSearch,
  tags
});
