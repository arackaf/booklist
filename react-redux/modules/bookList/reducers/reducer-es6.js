const { booksReducer: books, booksSelector } = require('./booksReducer');
const { subjectsReducer: subjects, subjectsSelector } = require('./subjectsReducer');
const { filtersReducer: filters, filtersSelector } = require('./filtersReducer');
const { bookSubjectManagerReducer: booksSubjectsModifier, booksSubjectsModifierSelector } = require('./booksSubjectModifierReducer');

const actionCreators = require('../actions/actionCreators');

const reducer = Redux.combineReducers({
    books,
    subjects,
    filters,
    booksSubjectsModifier
});

const bookListSelector = state => ({
    subjects: subjectsSelector(state.bookList),
    books: booksSelector(state.bookList),
    filters: filtersSelector(state.bookList),
    booksSubjectsModifier: booksSubjectsModifierSelector(state.bookList)
});

module.exports = { reducer, selector: bookListSelector };