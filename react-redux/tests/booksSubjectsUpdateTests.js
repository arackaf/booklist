'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../../react-redux/modules/books/reducers/actionNames'),
    LOAD_BOOKS_RESULTS = _require.LOAD_BOOKS_RESULTS;

var _require2 = require('../../react-redux/modules/books/reducers/booksSubjectModification/actionNames'),
    SET_BOOKS_SUBJECTS = _require2.SET_BOOKS_SUBJECTS;

var _require3 = require('../../react-redux/modules/books/reducers/actionCreators'),
    booksResults = _require3.booksResults;

var assert = require('chai').assert;

var _require4 = require('../../react-redux/modules/books/reducers/books/reducer'),
    booksReducer = _require4.booksReducer,
    booksSelector = _require4.booksSelector;

describe('books subject updating', function () {

    it('should should load some books', function () {
        var books = loadBooks([{ _id: 1, name: 'a', subjects: [] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }]);

        assert.strictEqual(books.list.length, 3);
    });

    it('should basic set', function () {
        var books = loadBooksAndSet([{ _id: 1, name: 'a', subjects: [] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }], { books: [1], add: [9], remove: [] });

        sameMembers(books.booksHash[1].subjects, [9]);
    });

    it('should set to existing', function () {
        var books = loadBooksAndSet([{ _id: 1, name: 'a', subjects: [8] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }], { books: [1], add: [9], remove: [] });

        sameMembers(books.booksHash[1].subjects, [8, 9]);
    });

    it('should add duplicate is ignored', function () {
        var books = loadBooksAndSet([{ _id: 1, name: 'a', subjects: [8] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }], { books: [1], add: [8], remove: [] });

        assert.strictEqual(books.booksHash[1].subjects.length, 1);
        sameMembers(books.booksHash[1].subjects, [8]);
    });

    it('should add 2 - 1 is a duplicate and ignored', function () {
        var books = loadBooksAndSet([{ _id: 1, name: 'a', subjects: [8] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }], { books: [1], add: [8, 9], remove: [] });

        assert.strictEqual(books.booksHash[1].subjects.length, 2);
        sameMembers(books.booksHash[1].subjects, [8, 9]);
    });

    it('should remove a subject', function () {
        var books = loadBooksAndSet([{ _id: 1, name: 'a', subjects: [8] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }], { books: [1], add: [], remove: [8] });

        sameMembers(books.booksHash[1].subjects, []);
    });

    it('should remove a subject and leave the other', function () {
        var books = loadBooksAndSet([{ _id: 1, name: 'a', subjects: [8, 9] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }], { books: [1], add: [], remove: [8] });

        sameMembers(books.booksHash[1].subjects, [9]);
    });

    it('should do all', function () {
        var books = loadBooksAndSet([{ _id: 1, name: 'a', subjects: [8, 9, 10] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }], { books: [1], add: [10, 11], remove: [8] });

        assert.strictEqual(books.booksHash[1].subjects.length, 3);
        sameMembers(books.booksHash[1].subjects, [9, 10, 11]);
    });
});

function sameMembers(actual, expected) {
    expected = expected.map(function (id) {
        return '' + id;
    });
    actual = actual.map(function (id) {
        return '' + id;
    });

    assert.sameMembers(actual, expected);
}

function loadBooks(books) {
    return apply({ type: LOAD_BOOKS_RESULTS, books: books });
}

function loadBooksAndSet(books, setPacket) {
    return apply({ type: LOAD_BOOKS_RESULTS, books: books }, _extends({ type: SET_BOOKS_SUBJECTS }, setPacket));
}

function apply() {
    var state = booksReducer(undefined, {});

    for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
        actions[_key] = arguments[_key];
    }

    actions.forEach(function (a) {
        return state = booksReducer(state, a);
    });

    return booksSelector({ books: state, subjects: { subjectHash: {}, list: [] } });
}