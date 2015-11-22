let BookViewList = require('./components/bookViewList');
let reducer = require('./reducers/reducer');

BookViewList = ReactRedux.connect(state => state.bookList)(BookViewList);

module.exports = {
    name: 'bookList',
    reducer: reducer,
    component: <BookViewList />
};
