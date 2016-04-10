import {
    UPDATE_ISBN,
    SAVE_ALL_PENDING,
    RESET_LIST,
    SET_PENDING,
    BOOK_SAVED,
    INCREMENT_PENDING,
    GET_BOOK,
    BOOK_QUEUED
} from './actionNames';

export function updateIsbn(isbn, index){
    return { type: UPDATE_ISBN, isbn, index };
}

export function enterBook(index, isbn){
    return function(dispatch) {
        dispatch(getBook(index));

        ajaxUtil.post('/book/saveFromIsbn', { isbn }, resp => dispatch(bookQueued(index)));
    }
}

export function bookQueued(index){
    return { type: BOOK_QUEUED, index };
}

export function getBook(index){
    return { type: GET_BOOK, index };
}


export function saveAllPending(){
    return function(dispatch, getState){
        let state = getState(),
            toSave = state.bookEntry.entryList.map((b, i) => ({ b, i })).filter(({ b }) => !b.fetched && !b.fetching && b.isbn.length);

        dispatch(gettingBooks(toSave.map(({ i }) => i)));
        toSave.forEach(({ b: book, i: index }) => enterBook(index, book.isbn));
    }
}

export function resetList(){
    return { type: RESET_LIST };
}

export function setPending(number){
    return { type: SET_PENDING, number }
}

export function incrementPending(){
    return { type: INCREMENT_PENDING }
}

export function bookSaved(book){
    return { type: BOOK_SAVED, book }
}