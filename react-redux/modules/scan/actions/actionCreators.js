'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.updateIsbn = updateIsbn;
exports.enterBook = enterBook;
exports.bookQueued = bookQueued;
exports.getBook = getBook;
exports.saveAllPending = saveAllPending;
exports.resetList = resetList;
exports.setPending = setPending;
exports.incrementPending = incrementPending;
exports.bookSaved = bookSaved;
exports.bookLookupFailed = bookLookupFailed;

var _actionNames = require('./actionNames');

function updateIsbn(isbn, index) {
    return { type: _actionNames.UPDATE_ISBN, isbn: isbn, index: index };
}

function enterBook(hello, isbn) {
    return function (dispatch) {
        executeEnterBook(hello, isbn, dispatch);
    };
}

function executeEnterBook(index, isbn, dispatch) {
    dispatch(getBook(index));

    ajaxUtil.post('/book/saveFromIsbn', { isbn: isbn }, function (resp) {
        return dispatch(bookQueued(index));
    });
}

function bookQueued(index) {
    return { type: _actionNames.BOOK_QUEUED, index: index };
}

function getBook(index) {
    return { type: _actionNames.GET_BOOK, index: index };
}

function saveAllPending() {
    return function (dispatch, getState) {
        var state = getState(),
            toSave = state.scan.entryList.map(function (b, i) {
            return { b: b, i: i };
        }).filter(function (_ref) {
            var b = _ref.b;
            return !b.queued && !b.queueing && b.isbn.length;
        });

        toSave.forEach(function (_ref2) {
            var book = _ref2.b;
            var index = _ref2.i;
            return executeEnterBook(index, book.isbn, dispatch);
        });
    };
}

function resetList() {
    return { type: _actionNames.RESET_LIST };
}

function setPending(number) {
    return { type: _actionNames.SET_PENDING, number: number };
}

function incrementPending() {
    return { type: _actionNames.INCREMENT_PENDING };
}

function bookSaved(book) {
    return { type: _actionNames.BOOK_SAVED, book: book };
}

function bookLookupFailed(isbn) {
    return { type: _actionNames.BOOK_LOOKUP_FAILED, isbn: isbn };
}