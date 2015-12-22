const { booksReducer } = require('./booksReducer');
const { subjectsReducer } = require('./subjectsReducer');
const filtersReducer = require('./filtersReducer');

const actionCreators = require('../actions/actionCreators');
const { createSelector } = require('/node_modules/reselect/lib/index');
const { setBookResultsSubjects } = require('../util/booksSubjectsHelpers');
const { stackAndGetTopLevelSubjects } = require('../util/booksSubjectsHelpers');

const initialState = () => ({
    books: booksReducer(),
    subjects: subjectsReducer(),
    filters: filtersReducer()
});

function reducer(state = initialState(), action = {}){
    return {
        books: booksReducer(state.books, action),
        subjects: subjectsReducer(state.subjects, action),
        filters: filtersReducer(state.filters, action)
    };
}

const booksWithSubjectsSelector = createSelector(
    [state => state.books.list, state => state.subjects.list],
    setBookResultsSubjects
);

const stackedSubjectsSelector = state => stackAndGetTopLevelSubjects(state.list);

const bookListSelector = state => ({
    subjects: Object.assign({}, state.bookList.subjects, {list: stackedSubjectsSelector(state.bookList.subjects)}),
    books: Object.assign({}, state.bookList.books, {list: booksWithSubjectsSelector(state.bookList)}),
    filters: state.bookList.filters
});

module.exports = { reducer, selector: bookListSelector };