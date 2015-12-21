let BookViewList = require('./components/bookViewList');
const reducer = require('./reducers/reducer');
const actionCreators = require('./actions/actionCreators');

const { setBookResultsSubjects, stackAndGetTopLevelSubjects } = require('./util/booksSubjectsHelpers');

const booksSelector = state => ({
    loading: state.books.loading,
    list: setBookResultsSubjects(state.books.list, state.subjects.list)
});

const bookListSelector = ({ bookList }) => ({
    subjects: bookList.subjects,
    books: booksSelector(bookList)
});

BookViewList = ReactRedux.connect(bookListSelector)(BookViewList);

module.exports = {
    name: 'bookList',
    reducer: reducer,
    component: <BookViewList />
};
