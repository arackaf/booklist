import {AppType} from 'applicationRoot/rootReducer';
import { combineReducers } from 'redux';
import { booksReducer as books, BooksReducerType} from './books/reducer';
import { tagsReducer as tags, TagsType } from './tags/reducer';
import { bookSearchReducer as bookSearch, bookSearchType, selectEntireBookSearchState } from './bookSearch/reducer';
import editBook, {editBookType} from './editBook/reducer';

export {AppType};
export {BooksReducerType};
export {bookSearchType};
export {editBookType};
export {TagsType};

export type BooksModuleType = {
    app: AppType;
    booksModule: {
        books: BooksReducerType;
        bookSearch: bookSearchType;
        editBook: editBookType;
        tags: TagsType;
    }
}

export const reducer = combineReducers({
    books,
    bookSearch,
    editBook,
    tags
});

