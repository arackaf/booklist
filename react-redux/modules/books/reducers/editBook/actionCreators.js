'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.editBook = editBook;
exports.saveEditingBook = saveEditingBook;
exports.stopEditingBook = stopEditingBook;

var _actionNames = require('./actionNames');

function editBook(book) {
    return { type: _actionNames.EDIT_BOOK, book: book };
}

function saveEditingBook(book) {
    return function (dispatch, getState) {
        dispatch({ type: _actionNames.EDITING_BOOK_SAVING });

        ajaxUtil.post('/book/update', { book: book }, function () {
            dispatch({ type: _actionNames.EDITING_BOOK_SAVED, book: book });
            setTimeout(function () {
                return dispatch({ type: _actionNames.EDIT_BOOK_RESET });
            }, 250);
        });
    };
}

function stopEditingBook() {
    return { type: _actionNames.STOP_EDITING_BOOK };
}