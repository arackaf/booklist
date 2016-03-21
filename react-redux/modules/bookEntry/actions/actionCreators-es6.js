import {
    UPDATE_ISBN,
    GET_BOOK,
    GET_BOOK_RESULTS,
    DELETE_BOOK,
    BOOK_DELETED,
    BOOK_DELETING,
    SAVE_ALL_PENDING,
    GETTING_BOOKS,
    RESET_LIST,
    SET_PENDING,
    BOOK_SAVED
} from './actionNames';

export function updateIsbn(isbn, index){
    return { type: UPDATE_ISBN, isbn, index };
}

export function getBook(index){
    return { type: GET_BOOK, index };
}

function gettingBooks(indexes){
    return { type: GETTING_BOOKS, indexes }
}

export function getBookResults(index, bookInfo){
    return { type: GET_BOOK_RESULTS, index, bookInfo };
}

export function loadAndSaveBook(index, isbn){
    return function(dispatch) {
        dispatch(getBook(index));

        ajaxUtil.post('/book/saveFromIsbn', { isbn }, bookInfo => dispatch(getBookResults(index, bookInfo)));
    }
}

export function saveAllPending(){
    return function(dispatch, getState){
        let state = getState(),
            toSave = state.bookEntry.entryList.map((b, i) => ({ b, i })).filter(({ b }) => !b.fetched && !b.fetching && b.isbn.length);

        dispatch(gettingBooks(toSave.map(({ i }) => i)));
        toSave.forEach(({ b: book, i: index }) => ajaxUtil.post('/book/saveFromIsbn', { isbn: book.isbn }, bookInfo => dispatch(getBookResults(index, bookInfo))));
    }
}

function deleted(index){
    return { type: BOOK_DELETED, index };
}

function deleteBookBegin(index){
    return { type: BOOK_DELETING, index };
}

export function deleteBook(index, id){
    return function(dispatch){
        dispatch(deleteBookBegin(index));
        ajaxUtil.post('/book/deleteBook', { id }, resp => {

            if (resp.success){
                dispatch(deleted(index));
            }
        });
    }
}

export function resetList(){
    return { type: RESET_LIST };
}

export function setPending(number){
    return { type: SET_PENDING, number }
}

export function bookSaved(book){
    return { type: BOOK_SAVED, book }
}