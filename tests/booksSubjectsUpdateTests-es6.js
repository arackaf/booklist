const { LOAD_BOOKS_RESULTS, SET_BOOKS_SUBJECTS } = require('../react-redux/modules/bookList/actions/actionNames');
const { booksResults } = require('../react-redux/modules/bookList/actions/actionCreators');

const assert = require('chai').assert;

const { booksReducer, booksSelector } = require('../react-redux/modules/bookList/reducers/booksReducer');

describe('books subject updating', function() {

    it('should load some books', function () {
        let books = loadBooks([{ _id: 1, name: 'a', subjects: [] }, { _id: 2, name: 'b', subjects: [] }, { _id: 3, name: 'c', subjects: [] }]);

        assert.strictEqual(books.length, 3);
    });

});

function loadBooks(books){
    return apply(
        { type: LOAD_BOOKS_RESULTS, books }
    )
}

function apply(...actions){
    let state = booksReducer(undefined, {});
    actions.forEach(a => state = booksReducer(state, a));

    return booksSelector({ books: state, subjects: { list: [] } }).list;
}
