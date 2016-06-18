let BookViewList = require('./components/bookViewList');
const { reducer, selector } = require('./reducers/reducer');

BookViewList = ReactRedux.connect(selector)(BookViewList);

module.exports = {
    name: 'books',
    reducer: reducer,
    component: BookViewList
};