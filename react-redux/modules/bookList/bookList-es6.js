let BookViewList = require('./components/bookViewList');
const reducer = require('./reducers/reducer');
const actionCreators = require('./actions/actionCreators');
const { createSelector } = require('/node_modules/reselect/lib/index');

const { setBookResultsSubjects } = require('./util/booksSubjectsHelpers');

const stackedBooklistSelector = createSelector(
    [state => state.books.list, state => state.subjects.list],
    setBookResultsSubjects
);

const bookListSelector = state => ({
    subjects: state.bookList.subjects,
    books: Object.assign({}, state.bookList, { list: stackedBooklistSelector(state.bookList) })
});

BookViewList = ReactRedux.connect(bookListSelector)(BookViewList);

module.exports = {
    name: 'bookList',
    reducer: reducer,
    component: <BookViewList />
};
