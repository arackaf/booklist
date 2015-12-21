'use strict';

var _require = require('../actions/actionNames');

var LOAD_BOOKS = _require.LOAD_BOOKS;
var LOAD_BOOKS_RESULTS = _require.LOAD_BOOKS_RESULTS;
var TOGGLE_SELECT_BOOK = _require.TOGGLE_SELECT_BOOK;
var SELECT_ALL_BOOKS = _require.SELECT_ALL_BOOKS;
var DE_SELECT_ALL_BOOKS = _require.DE_SELECT_ALL_BOOKS;

var _require2 = require('../util/booksSubjectsHelpers');

var setBookResultsSubjects = _require2.setBookResultsSubjects;

function booksReducer(state, subjects) {
    if (state === undefined) state = initialBooksState();
    var action = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    switch (action.type) {
        case LOAD_BOOKS:
            return Object.assign({}, state, { loading: true });
        case LOAD_BOOKS_RESULTS:
            setBookResultsSubjects(action.books, subjects);
            return Object.assign({}, state, { loading: false, list: action.books });
        case TOGGLE_SELECT_BOOK:
            var newBookList = state.list.map(function (b) {
                return Object.assign({}, b, { selected: b._id == action._id ? !b.selected : b.selected });
            });
            return Object.assign({}, state, { list: newBookList, selectedCount: newBookList.filter(function (b) {
                    return b.selected;
                }).length });
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
    }
    return state;
}

var initialBooksState = function initialBooksState() {
    return {
        list: [],
        loading: false
    };
};

module.exports = { booksReducer: booksReducer };