import {BooksModuleType, booksType, bookSearchType, editBookType, TagsType} from 'modules/books/reducers/reducer';
import {
    EDIT_BOOK,
    STOP_EDITING_BOOK,
    SAVE_EDITING_BOOK,
    EDITING_BOOK_SAVING,
    EDITING_BOOK_SAVED,
    EDIT_BOOK_RESET
} from './actionNames';

const initialState = {
    isEditingBook: false,
    editingBook: {},
    editingBookSaving: false,
    editingBookSaved: false
}
export type editBookType = typeof initialState & { editingBook : any };

export default function reducer(state = initialState, action) : editBookType {
    switch(action.type){
        case EDIT_BOOK:
            return { ...state, editingBook: action.book, isEditingBook: true };
        case STOP_EDITING_BOOK:
            return { ...state, editingBookSaved: false, editingBookSaving: false, isEditingBook: false } //leave the book object so the modal fade is a bit nicer
        case EDITING_BOOK_SAVING:
            return { ...state, editingBookSaving: true };
        case EDITING_BOOK_SAVED:
            return { ...state, editingBookSaving: false, editingBookSaved: true, isEditingBook: false }; //close the modal immediately
        case EDIT_BOOK_RESET:
            return { ...initialState };
    }
    return state;
}