const { booksReducer, booksSelector } = require('./booksReducer');
const { subjectsReducer } = require('./subjectsReducer');
const filtersReducer = require('./filtersReducer');

const actionCreators = require('../actions/actionCreators');
const { createSelector } = require('../../../util/reselect');
const { stackAndGetTopLevelSubjects } = require('../util/booksSubjectsHelpers');
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

const stackedSubjectsSelector = createSelector(
    [state => state.list],
    stackAndGetTopLevelSubjects
);

const bookListSelector = state => ({
    subjects: Object.assign({}, state.bookList.subjects, {list: stackedSubjectsSelector(state.bookList.subjects)}),
    books: booksSelector(state.bookList),
    filters: state.bookList.filters,
    booksSubjectsModifier: booksSubjectsModifierSelector(state.bookList)
});

module.exports = { reducer, selector: bookListSelector };