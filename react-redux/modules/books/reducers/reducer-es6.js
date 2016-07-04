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
    let booksSelected = booksSelector(state.books),
        subjectsSelected = subjectsSelector(state.books);

    return {
        subjects: subjectsSelected.list,
        subjectsLoaded: subjectsSelected.loaded,
        books: booksSelected.list,
        selectedBooks: booksSelected.selectedBooks,
        booksLoading: booksSelected.loading,
        bookSearch: bookSearchSelector(state.books),
        booksSubjectsModifier: booksSubjectsModifierSelector(state.books),
        bookEdit: state.books.bookEdit, //no selector on bookEdit
        isDesktop: state.books.ui.isDesktop,
        isMobile: state.books.ui.isMobile
    }
};
