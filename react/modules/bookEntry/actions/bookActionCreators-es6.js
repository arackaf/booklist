const { UPDATE_ISBN, CURRENT_INPUT_FINISHED, INITIALIZE_ENTRY_LIST, GET_BOOK, GET_BOOK_RESULTS } = require('./bookActionNames');

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

module.exports = {
    updateIsbn,
    currentInputFinished,
    initializeEntryList,
    getBook,
    getBookResults,
    loadAndSaveBook
};

