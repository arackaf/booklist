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
    let booksSelected = booksSelector(state);
    let subjectsSelected = subjectsSelector(state),
        bookEdit = state.books.bookEdit,
        bookSearch = bookSearchSelector(state),
        ui = state.books.ui;

    return {
        subjects: subjectsSelected.list,
        subjectsLoaded: subjectsSelected.loaded,
        books: booksSelected.list,
        reloadBooksOnActivate: booksSelected.reloadOnActivate,
        selectedBooks: booksSelected.selectedBooks,
        booksLoading: booksSelected.loading,
        currentSort: bookSearch.sort,
        sortDirection: bookSearch.sortDirection,
        isEditingBook: bookEdit.isEditing,
        editingBook: bookEdit.editingBook,
        editingBookSaving: bookEdit.editingBookSaving,
        editingBookSaved: bookEdit.editingBookSaved,
        isDesktop: ui.isDesktop,
        isMobile: ui.isMobile
    }
};
