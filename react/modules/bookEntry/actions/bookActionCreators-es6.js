const { UPDATE_ISBN, CURRENT_INPUT_FINISHED, INITIALIZE_ENTRY_LIST, GET_BOOK, GET_BOOK_RESULTS, DELETE_BOOK, BOOK_DELETED } = require('./bookActionNames');

function updateIsbn(isbn, entry){
    return { type: UPDATE_ISBN, isbn, entry };
}

function currentInputFinished(index){
    return { type: CURRENT_INPUT_FINISHED, index };
}

function initializeEntryList(count){
    return { type: INITIALIZE_ENTRY_LIST, count };
}

function getBook(index){
    return { type: GET_BOOK, index };
}

function getBookResults(index, bookInfo){
    return { type: GET_BOOK_RESULTS, index, bookInfo };
}

function loadAndSaveBook(index, isbn){
    return function(dispatch) {
        dispatch(getBook(index));

        ajaxUtil.post('/book/saveFromIsbn', { isbn }, bookInfo => dispatch(getBookResults(index, bookInfo)));
    }
}

function deleted(index){
    return { type: BOOK_DELETED, index };
}

function deleteBook(index, id){
    return function(dispatch){
        ajaxUtil.post('/book/deleteBook', { id }, resp => {
            debugger;
            if (resp.success){
                dispatch(deleted(index));
            }
        });
    }
}

module.exports = {
    updateIsbn,
    currentInputFinished,
    initializeEntryList,
    getBook,
    getBookResults,
    loadAndSaveBook,
    deleteBook
};

