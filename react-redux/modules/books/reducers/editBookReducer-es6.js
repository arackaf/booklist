import {
    EDIT_BOOK,
    STOP_EDITING_BOOK,
    SAVE_EDITING_BOOK
} from '../actions/bookEdit/actionNames';

const initialState = {
    isEditing: false,
    editingBook: {},
    editingBookSaving: false,
    editingBookSaved: false
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case EDIT_BOOK:
            return { ...state, editingBook: action.book, isEditing: true };
        case STOP_EDITING_BOOK:
            return { ...state, editingBookSaved: false, editingBookSaving: false, isEditing: false } //leave the book object so the modal fade is a bit nicer
    }
    return state;
}