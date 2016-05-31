'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _editBookActionNames = require('../editBook/actionNames');

var _require = require('react-redux-util/reselect');

var createSelector = _require.createSelector;

var _require2 = require('../actionNames');

var LOAD_BOOKS = _require2.LOAD_BOOKS;
var LOAD_BOOKS_RESULTS = _require2.LOAD_BOOKS_RESULTS;
var TOGGLE_SELECT_BOOK = _require2.TOGGLE_SELECT_BOOK;
var SELECT_ALL_BOOKS = _require2.SELECT_ALL_BOOKS;
var DE_SELECT_ALL_BOOKS = _require2.DE_SELECT_ALL_BOOKS;
var SUBJECT_DELETED = _require2.SUBJECT_DELETED;

var _require3 = require('../booksSubjectModification/actionNames');

var SET_BOOKS_SUBJECTS = _require3.SET_BOOKS_SUBJECTS;

var _require4 = require('../../util/booksSubjectsHelpers');

var adjustBooksForDisplay = _require4.adjustBooksForDisplay;

var initialBooksState = {
    booksHash: {},
    loading: false,
    selectedBooks: {}
};

function booksReducer(state, action) {
    if (state === undefined) state = initialBooksState;

    switch (action.type) {
        case LOAD_BOOKS:
            return Object.assign({}, state, { loading: true });
        case LOAD_BOOKS_RESULTS:
            return Object.assign({}, state, { loading: false, booksHash: createBooksHash(action.books) });
        case _editBookActionNames.EDITING_BOOK_SAVED:
            var newBookVersion = Object.assign({}, state.booksHash[action.book._id], action.book); //only update fields sent
            return Object.assign({}, state, { booksHash: _extends({}, state.booksHash, _defineProperty({}, action.book._id, newBookVersion)) });
        case TOGGLE_SELECT_BOOK:
            return Object.assign({}, state, { selectedBooks: _extends({}, state.selectedBooks, _defineProperty({}, action._id, !state.selectedBooks[action._id])) });
        case SELECT_ALL_BOOKS:
            var newBookList = state.list.map(function (b) {
                return Object.assign({}, b, { selected: true });
            });
            return Object.assign({}, state, { list: newBookList, selectedCount: newBookList.length });
        case DE_SELECT_ALL_BOOKS:
            var newBookList = state.list.map(function (b) {
                return Object.assign({}, b, { selected: false });
            });
            return Object.assign({}, state, { list: newBookList, selectedCount: 0 });
        case SET_BOOKS_SUBJECTS:
            var newBookHash = _extends({}, state.booksHash);

            action.books.forEach(function (_id) {
                var book = _extends({}, newBookHash[_id]),
                    booksSubjectsHash = {};

                book.subjects.forEach(function (_id) {
                    return booksSubjectsHash[_id] = true;
                });

                action.add.forEach(function (sAdd) {
                    return booksSubjectsHash[sAdd] = true;
                });
                action.remove.forEach(function (sAdd) {
                    return booksSubjectsHash[sAdd] = false;
                });

                book.subjects = Object.keys(booksSubjectsHash).filter(function (_id) {
                    return booksSubjectsHash[_id];
                });
                newBookHash[_id] = book;
            });

            return Object.assign({}, state, { booksHash: newBookHash });
        case SUBJECT_DELETED:
            var newBookHash = Object.assign({}, state.booksHash);
            action.booksUpdated.forEach(function (_id) {
                var bookEntry = newBookHash[_id];
                newBookHash[_id] = _extends({}, bookEntry, { subjects: bookEntry.subjects.filter(function (sid) {
                        return sid != action.subjectId;
                    }) });
            });
            return Object.assign({}, state, { booksHash: newBookHash });
    }
    return state;
}

function createBooksHash(booksArr) {
    var result = {};
    booksArr.forEach(function (book) {
        return result[book._id] = book;
    });
    return result;
}

var booksWithSubjectsSelector = createSelector([function (state) {
    return state.books.booksHash;
}, function (state) {
    return state.subjects.subjectHash;
}], adjustBooksForDisplay);

var booksSelector = function booksSelector(state) {
    return Object.assign({}, state.books, {
        list: booksWithSubjectsSelector(state),
        selectedBooksCount: Object.keys(state.books.selectedBooks).filter(function (k) {
            return state.books.selectedBooks[k];
        }).length
    });
};

module.exports = { booksReducer: booksReducer, booksSelector: booksSelector };