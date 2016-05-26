import {
    EDIT_BOOK,
    STOP_EDITING_BOOK,
    SAVE_EDITING_BOOK
} from './actionNames';

export function editBook(book){
    return { type: EDIT_BOOK, book };
}

export function stopEditingBook(){
    return { type: STOP_EDITING_BOOK };
}