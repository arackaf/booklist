const { LOAD_BOOKS_RESULTS } = require('../../react-redux/modules/bookList/actions/actionNames');
const { SET_BOOKS_SUBJECTS } = require('../../react-redux/modules/bookList/actions/bookSubjectModify/actionNames');
const { booksResults } = require('../../react-redux/modules/bookList/actions/actionCreators');

const assert = require('chai').assert;

const { booksReducer, booksSelector } = require('../../react-redux/modules/bookList/reducers/booksReducer');

describe('books subject updating', function() {

    it('should should load some books', function () {
        let books = loadBooks([{ _id: 1, name: 'a', subjects: [] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }]);

        assert.strictEqual(books.list.length, 3);
    });

    it('should basic set', function () {
        let books = loadBooksAndSet(
            [{ _id: 1, name: 'a', subjects: [] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }],
            { books: [1], add: [9], remove: [] }
        );

        sameMembers(books.booksHash[1].subjects, [9]);
    });

    it('should set to existing', function () {
        let books = loadBooksAndSet(
            [{ _id: 1, name: 'a', subjects: [8] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }],
            { books: [1], add: [9], remove: [] }
        );

        sameMembers(books.booksHash[1].subjects, [8, 9]);
    });

    it('should add duplicate is ignored', function () {
        let books = loadBooksAndSet(
            [{ _id: 1, name: 'a', subjects: [8] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }],
            { books: [1], add: [8], remove: [] }
        );

        assert.strictEqual(books.booksHash[1].subjects.length, 1);
        sameMembers(books.booksHash[1].subjects, [8]);
    });

    it('should add 2 - 1 is a duplicate and ignored', function () {
        let books = loadBooksAndSet(
            [{ _id: 1, name: 'a', subjects: [8] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }],
            { books: [1], add: [8, 9], remove: [] }
        );

        assert.strictEqual(books.booksHash[1].subjects.length, 2);
        sameMembers(books.booksHash[1].subjects, [8, 9]);
    });

    it('should remove a subject', function () {
        let books = loadBooksAndSet(
            [{ _id: 1, name: 'a', subjects: [8] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }],
            { books: [1], add: [], remove: [8] }
        );

        sameMembers(books.booksHash[1].subjects, []);
    });

    it('should remove a subject and leave the other', function () {
        let books = loadBooksAndSet(
            [{ _id: 1, name: 'a', subjects: [8, 9] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }],
            { books: [1], add: [], remove: [8] }
        );

        sameMembers(books.booksHash[1].subjects, [9]);
    });

    it('should do all', function () {
        let books = loadBooksAndSet(
            [{ _id: 1, name: 'a', subjects: [8, 9, 10] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }],
            { books: [1], add: [10, 11], remove: [8] }
        );

        assert.strictEqual(books.booksHash[1].subjects.length, 3);
        sameMembers(books.booksHash[1].subjects, [9, 10, 11]);
    });

});

function sameMembers(actual, expected){
    expected = expected.map(id => '' + id);
    actual = actual.map(id => '' + id);

    assert.sameMembers(actual, expected);
}

function loadBooks(books){
    return apply(
        { type: LOAD_BOOKS_RESULTS, books }
    )
}

function loadBooksAndSet(books, setPacket){
    return apply(
        { type: LOAD_BOOKS_RESULTS, books },
        { type: SET_BOOKS_SUBJECTS, ...setPacket }
    );
}

function apply(...actions){
    let state = booksReducer(undefined, {});
    actions.forEach(a => state = booksReducer(state, a));

    return booksSelector({ books: state, subjects: { subjectHash: {}, list: [] } });
}
