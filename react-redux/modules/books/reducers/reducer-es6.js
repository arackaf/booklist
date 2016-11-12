import { combineReducers } from 'redux';
import { booksReducer as books, booksSelector } from './books/reducer';
import { subjectsReducer as subjects, subjectsSelector } from './subjects/reducer';
import { tagsReducer as tags, tagsSelector } from './tags/reducer';
import { bookSearchReducer as bookSearch, bookSearchSelector } from './bookSearch/reducer';
import { bookSubjectManagerReducer as booksSubjectsModifier, booksSubjectsModifierSelector } from './booksSubjectModification/reducer';
import { bookTagManagerReducer as booksTagsModifier, booksTagsModifierSelector } from './booksTagModification/reducer';
import bookEdit from './editBook/reducer';

export const reducer = combineReducers({
    books,
    subjects,
    bookSearch,
    booksSubjectsModifier,
    booksTagsModifier,
    bookEdit,
    tags
});

export const selector = state => {
    let booksSelected = booksSelector(state),
        subjectsSelected = subjectsSelector(state),
        tagsSelected = tagsSelector(state),
        bookEdit = state.booksModule.bookEdit,
        bookSearch = bookSearchSelector(state),
        app = state.app;

    return {
        subjects: subjectsSelected.list,
        subjectsLoaded: subjectsSelected.loaded,
        tags: tagsSelected.allTagsSorted,
        tagsLoaded: tagsSelected.loaded,
        books: booksSelected.list,
        hasMoreBooks: bookSearch.hasMore,
        currentPage: bookSearch.page,
        reloadBooksOnActivate: booksSelected.reloadOnActivate,
        initialBookQueryFired: booksSelected.initialQueryFired,
        viewingPublic: app.isPublic,
        allAreChecked: booksSelected.allAreChecked,
        selectedBooks: booksSelected.selectedBooks,
        booksLoading: booksSelected.loading,
        currentSort: bookSearch.sort,
        sortDirection: bookSearch.sortDirection,
        isEditingBook: bookEdit.isEditing,
        editingBook: bookEdit.editingBook,
        editingBookSaving: bookEdit.editingBookSaving,
        editingBookSaved: bookEdit.editingBookSaved,
        isDesktop: app.isDesktop,
        isMobile: app.isMobile,
        showingDesktop: app.isDesktop,
        showingMobile: app.isMobile
    };
};
