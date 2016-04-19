let BookViewList = require('./components/bookViewList');
const { reducer, selector } = require('./reducers/reducer');

BookViewList = ReactRedux.connect(selector)(BookViewList);

module.exports = {
    name: 'bookList',
    reducer: reducer,
    component: <BookViewList />
};
