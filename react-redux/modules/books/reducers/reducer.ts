import {appType} from 'applicationRoot/rootReducer';
import { combineReducers } from 'redux';
import { booksReducer as books, booksType} from './books/reducer';
import { subjectsReducer as subjects, subjectsType, subjectsSelector } from './subjects/reducer';
import { tagsReducer as tags, tagsType, tagsSelector } from './tags/reducer';
import { bookSearchReducer as bookSearch, bookSearchType, bookSearchSelector } from './bookSearch/reducer';
import { bookSubjectManagerReducer as booksSubjectsModifier, booksSubjectMofificationType, booksSubjectsModifierSelector } from './booksSubjectModification/reducer';
import { bookTagManagerReducer as booksTagsModifier, booksTagModificationType, booksTagsModifierSelector } from './booksTagModification/reducer';
import editBook, {editBookType} from './editBook/reducer';

export {appType};
export {booksType};
export {bookSearchType};
export {booksSubjectMofificationType};
export {booksTagModificationType};
export {editBookType};
export {subjectsType};
export {tagsType};


import {modifyingBooksSelector as subjectsBooksModifyingSelector} from './booksSubjectModification/reducer';
import {modifyingBooksSelector as tagsBooksModifyingSelector} from './booksTagModification/reducer';

export type booksModuleType = {
    app: appType;
    booksModule: {
        books: booksType;
        subjects: subjectsType;
        bookSearch: bookSearchType;
        booksSubjectsModifier: booksSubjectMofificationType;
        booksTagsModifier: booksTagModificationType;
        editBook: editBookType;
        tags: tagsType;
    }
}

export const reducer = combineReducers({
    books,
    subjects,
    bookSearch,
    booksSubjectsModifier,
    booksTagsModifier,
    editBook,
    tags
});

