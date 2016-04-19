const { booksReducer: books, booksSelector } = require('./booksReducer');
const { subjectsReducer: subjects, subjectsSelector } = require('./subjectsReducer');
const { bookSearchReducer: bookSearch, bookSearchSelector } = require('./bookSearchReducer');
const { bookSubjectManagerReducer: booksSubjectsModifier, booksSubjectsModifierSelector } = require('./booksSubjectModifierReducer');

const actionCreators = require('../actions/actionCreators');

const reducer = Redux.combineReducers({
    books,
    subjects,
    bookSearch,
    booksSubjectsModifier
});

const bookListSelector = state => {
    return {
        subjects: subjectsSelector(state.bookList),
        books: booksSelector(state.bookList),
        bookSearch: bookSearchSelector(state.bookList),
        booksSubjectsModifier: booksSubjectsModifierSelector(state.bookList)
    }
};

module.exports = { reducer, selector: bookListSelector };