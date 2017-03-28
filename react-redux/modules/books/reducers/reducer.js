import { combineReducers } from 'redux';
import { booksReducer as books, booksSelector } from './books/reducer';
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

export const selector = state => {
    let booksSelected = booksSelector(state),
        tagsSelected = tagsSelector(state),
        bookEdit = state.booksModule.bookEdit,
        bookSearch = bookSearchSelector(state),
        subjectsBooksModifying = subjectsBooksModifyingSelector(state),
        tagsBooksModifying = tagsBooksModifyingSelector(state),
        app = state.app;

    return {
        subjectsLoaded: app.subjectsLoaded,
        tagsLoaded: tagsSelected.loaded,
        books: booksSelected.list,
        isGridView: bookSearch.isGridView,
        isBasicList: bookSearch.isBasicList,
        hasMoreBooks: bookSearch.hasMore,
        currentPage: bookSearch.page,
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
        subjectsBooksModifyingCount: subjectsBooksModifying.length,
        tagsBooksModifyingCount: tagsBooksModifying.length,
        subjectEditModalOpen: state.booksModule.subjects.editModalOpen,
        tagEditModalOpen: state.booksModule.tags.editTagOpen,
        editingBookSearchFilters: state.booksModule.bookSearch.editingFilters
    };
};
