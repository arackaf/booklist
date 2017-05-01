import { combineReducers } from 'redux';
import { booksReducer as books} from './books/reducer';
import { subjectsReducer as subjects, subjectsSelector } from './subjects/reducer';
import { tagsReducer as tags, tagsSelector } from './tags/reducer';
import { bookSearchReducer as bookSearch, bookSearchSelector } from './bookSearch/reducer';
import { bookSubjectManagerReducer as booksSubjectsModifier, booksSubjectsModifierSelector } from './booksSubjectModification/reducer';
import { bookTagManagerReducer as booksTagsModifier, booksTagsModifierSelector } from './booksTagModification/reducer';
import bookEdit from './editBook/reducer';


import {modifyingBooksSelector as subjectsBooksModifyingSelector} from './booksSubjectModification/reducer';
import {modifyingBooksSelector as tagsBooksModifyingSelector} from './booksTagModification/reducer';

export const reducer = combineReducers({
    books,
    subjects,
    bookSearch,
    booksSubjectsModifier,
    booksTagsModifier,
    bookEdit,
    tags
});

