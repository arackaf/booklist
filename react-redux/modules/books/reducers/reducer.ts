import {appType} from 'applicationRoot/rootReducer';
import { combineReducers } from 'redux';
import { booksReducer as books, booksType} from './books/reducer';
import { tagsReducer as tags, tagsType } from './tags/reducer';
import { bookSearchReducer as bookSearch, bookSearchType, selectEntireBookSearchState } from './bookSearch/reducer';
import { bookSubjectManagerReducer as booksSubjectsModifier, booksSubjectMofificationType, selectEntireBooksSubjectsModificationState } from './booksSubjectModification/reducer';
import { bookTagManagerReducer as booksTagsModifier, booksTagModificationType, selectEntireBooksTagModificationState } from './booksTagModification/reducer';
import editBook, {editBookType} from './editBook/reducer';

export {appType};
export {booksType};
export {bookSearchType};
export {booksSubjectMofificationType};
export {booksTagModificationType};
export {editBookType};
export {tagsType};


import {selectModifyingBooks as subjectsBooksModifyingSelector} from './booksSubjectModification/reducer';
import {selectModifyingBooks as tagsBooksModifyingSelector} from './booksTagModification/reducer';

export type BooksModuleType = {
    app: appType;
    booksModule: {
        books: booksType;
        bookSearch: bookSearchType;
        booksSubjectsModifier: booksSubjectMofificationType;
        booksTagsModifier: booksTagModificationType;
        editBook: editBookType;
        tags: tagsType;
    }
}

export const reducer = combineReducers({
    books,
    bookSearch,
    booksSubjectsModifier,
    booksTagsModifier,
    editBook,
    tags
});

