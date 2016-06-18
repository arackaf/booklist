import BookViewList from './components/bookViewList';
const { reducer, selector } = require('./reducers/reducer');

export default {
    name: 'books',
    reducer: reducer,
    component: BookViewList
};