let BookViewList = require('./components/bookViewList');
const reducer = require('./reducers/reducer');
const actionCreators = require('./actions/actionCreators');

BookViewList = ReactRedux.connect(state => state.bookList)(BookViewList);

module.exports = {
    name: 'bookList',
    reducer: reducer,
    component: <BookViewList />
};
