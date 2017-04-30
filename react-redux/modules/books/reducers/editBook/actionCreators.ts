import {
    EDIT_BOOK,
    STOP_EDITING_BOOK,
    SAVE_EDITING_BOOK,
    EDITING_BOOK_SAVING,
    EDITING_BOOK_SAVED,
    EDIT_BOOK_RESET
} from './actionNames';
import ajaxUtil from 'util/ajaxUtil';

export function editBook(book){
    return { type: EDIT_BOOK, book };
}

export function saveEditingBook(book){
    return function(dispatch, getState){
        dispatch({ type: EDITING_BOOK_SAVING });

        ajaxUtil.post('/book/update', { book }, () => {
            dispatch({ type: EDITING_BOOK_SAVED, book });
            setTimeout(() => dispatch({ type: EDIT_BOOK_RESET }), 250);
        });
    };
}

export function stopEditingBook(){
    return { type: STOP_EDITING_BOOK };
}