import {appType} from 'applicationRoot/rootReducer';
import { combineReducers } from 'redux';
import { booksReducer as books, BooksReducerType} from './books/reducer';
import { tagsReducer as tags, TagsType } from './tags/reducer';
import { bookSearchReducer as bookSearch, bookSearchType, selectEntireBookSearchState } from './bookSearch/reducer';
import editBook, {editBookType} from './editBook/reducer';

export {appType};
export {BooksReducerType};
export {bookSearchType};
export {editBookType};
export {TagsType};

export type BooksModuleType = {
    app: appType;
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

