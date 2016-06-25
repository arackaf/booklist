import { combineReducers } from 'redux';
import { booksReducer as books, booksSelector } from './books/reducer';
import { subjectsReducer as subjects, subjectsSelector } from './subjects/reducer';
import { bookSearchReducer as bookSearch, bookSearchSelector } from './bookSearch/reducer';
import { bookSubjectManagerReducer as booksSubjectsModifier, booksSubjectsModifierSelector } from './booksSubjectModification/reducer';
import bookEdit from './editBook/reducer';
import ui from './ui/reducer';

export const reducer = combineReducers({
    books,
    subjects,
    bookSearch,
    booksSubjectsModifier,
    bookEdit,
    ui
});

export const selector = state => {
    return {
        subjects: subjectsSelector(state.books),
        books: booksSelector(state.books),
        bookSearch: bookSearchSelector(state.books),
        booksSubjectsModifier: booksSubjectsModifierSelector(state.books),
        bookEdit: state.books.bookEdit, //no selector on bookEdit
        ui: state.books.ui //no selector on ui
    }
};
