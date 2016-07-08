import BookViewList from './components/bookViewList';
import { reducer, selector } from './reducers/reducer';

export default {
    name: 'books',
    reducer: reducer,
    component: BookViewList
};