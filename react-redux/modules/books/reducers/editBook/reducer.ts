import {
    EDIT_BOOK,
    STOP_EDITING_BOOK,
    SAVE_EDITING_BOOK,
    EDITING_BOOK_SAVING,
    EDITING_BOOK_SAVED,
    EDIT_BOOK_RESET
} from './actionNames';

const initialState = {
    isEditing: false,
    editingBook: {},
    editingBookSaving: false,
    editingBookSaved: false
}
export type editBookType = typeof initialState;

export default function reducer(state = initialState, action) : editBookType {
    switch(action.type){
        case EDIT_BOOK:
            return { ...state, editingBook: action.book, isEditing: true };
        case STOP_EDITING_BOOK:
            return { ...state, editingBookSaved: false, editingBookSaving: false, isEditing: false } //leave the book object so the modal fade is a bit nicer
        case EDITING_BOOK_SAVING:
            return { ...state, editingBookSaving: true };
        case EDITING_BOOK_SAVED:
            return { ...state, editingBookSaving: false, editingBookSaved: true, isEditing: false }; //close the modal immediately
        case EDIT_BOOK_RESET:
            return { ...initialState };
    }
    return state;
}