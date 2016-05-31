'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.cancelBookSubjectModification = cancelBookSubjectModification;
exports.setBooksSubjects = setBooksSubjects;
exports.toggleSubjectModificationAdd = toggleSubjectModificationAdd;
exports.toggleSubjectModificationRemove = toggleSubjectModificationRemove;
exports.enableSubjectModificationSingleBook = enableSubjectModificationSingleBook;
exports.enableSubjectModificationToggledBooks = enableSubjectModificationToggledBooks;
exports.subjectModificationClearSubjects = subjectModificationClearSubjects;

var _actionNames = require('./actionNames');

function cancelBookSubjectModification() {
    return { type: _actionNames.CANCEL_BOOKS_SUBJECT_MODIFICATION };
}

function setBooksSubjects(books, add, remove) {
    return function (dispatch, getState) {
        dispatch({ type: _actionNames.SETTING_BOOKS_SUBJECTS });
        ajaxUtil.post('/bookBulk/setSubjects', { books: books, add: add, remove: remove }, function (resp) {
            dispatch({ type: _actionNames.SET_BOOKS_SUBJECTS, books: books, add: add, remove: remove });
            dispatch({ type: _actionNames.FINISHED_SUBJECT_MODIFICATION });
        });
    };
}

function toggleSubjectModificationAdd(_id) {
    return { type: _actionNames.TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION, _id: _id };
}

function toggleSubjectModificationRemove(_id) {
    return { type: _actionNames.TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION, _id: _id };
}

function enableSubjectModificationSingleBook(_id) {
    return { type: _actionNames.ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK, _id: _id };
}

function enableSubjectModificationToggledBooks() {
    return { type: _actionNames.ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS };
}

function subjectModificationClearSubjects() {
    return { type: _actionNames.CLEAR_SUBJECT_MODIFICATION_SUBJECTS };
}