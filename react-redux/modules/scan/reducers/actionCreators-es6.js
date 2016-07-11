import {
    UPDATE_ISBN,
    SAVE_ALL_PENDING,
    RESET_LIST,
    SET_PENDING,
    BOOK_SAVED,
    INCREMENT_PENDING,
    GET_BOOK,
    BOOK_QUEUED,
    BOOK_LOOKUP_FAILED
} from './actionNames';

export function updateIsbn(isbn, index){
    return { type: UPDATE_ISBN, isbn, index };
}

export function enterBook(index, isbn){
    return function(dispatch) {
        executeEnterBook(index, isbn, dispatch);
    }
}

function executeEnterBook(index, isbn, dispatch){
    dispatch(getBook(index));

    ajaxUtil.post('/book/saveFromIsbn', { isbn }, resp => dispatch(bookQueued(index)));
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
            toSave = state.scanModule.entryList.map((b, i) => ({ b, i })).filter(({ b }) => !b.queued && !b.queueing && b.isbn.length);

        toSave.forEach(({ b: book, i: index }) => executeEnterBook(index, book.isbn, dispatch));
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

export function bookLookupFailed(isbn){
    return { type: BOOK_LOOKUP_FAILED, isbn }
}