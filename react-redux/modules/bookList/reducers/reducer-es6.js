const { booksReducer, booksSelector } = require('./booksReducer');
const { subjectsReducer, subjectsSelector } = require('./subjectsReducer');
const { filtersReducer, filtersSelector } = require('./filtersReducer');

const actionCreators = require('../actions/actionCreators');
const { bookSubjectManagerReducer, booksSubjectsModifierSelector } = require('./booksSubjectModifier');

const initialState = () => ({
    books: booksReducer(),
    subjects: subjectsReducer(),
    filters: filtersReducer()
});

function reducer(state = initialState(), action = {}){
    return {
        books: booksReducer(state.books, action),
        subjects: subjectsReducer(state.subjects, action),
        filters: filtersReducer(state.filters, action),
        booksSubjectsModifier: bookSubjectManagerReducer(state.booksSubjectsModifier, action)
    };
}

const bookListSelector = state => ({
    subjects: subjectsSelector(state.bookList),
    books: booksSelector(state.bookList),
    filters: filtersSelector(state.bookList),
    booksSubjectsModifier: booksSubjectsModifierSelector(state.bookList)
});

module.exports = { reducer, selector: bookListSelector };