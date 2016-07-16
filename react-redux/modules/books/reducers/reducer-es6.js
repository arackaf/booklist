import { combineReducers } from 'redux';
import { booksReducer as books, booksSelector } from './books/reducer';
import { subjectsReducer as subjects, subjectsSelector } from './subjects/reducer';
import { tagsReducer as tags, tagsSelector } from './tags/reducer';
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
    ui,
    tags
});

export const selector = state => {
    let booksSelected = booksSelector(state),
        subjectsSelected = subjectsSelector(state),
        tagsSelected = tagsSelector(state),
        bookEdit = state.booksModule.bookEdit,
        bookSearch = bookSearchSelector(state),
        ui = state.booksModule.ui,
        root = state.root;

    return {
        subjects: subjectsSelected.list,
        subjectsLoaded: subjectsSelected.loaded,
        tags: tagsSelected.allTagsSorted,
        tagsLoaded: tagsSelected.loaded,
        books: booksSelected.list,
        reloadBooksOnActivate: booksSelected.reloadOnActivate,
        viewingPublic: root.isPublic,
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
    };
};
