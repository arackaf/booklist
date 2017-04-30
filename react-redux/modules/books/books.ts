import BookViewList from './components/bookViewList';
import {reducer} from './reducers/reducer';
import {syncFiltersToHash} from './reducers/bookSearch/actionCreators';
import {booksActivated} from './reducers/bookSearch/actionCreators';
import {store} from 'applicationRoot/store';

export default {
    name: 'books',
    reducer: reducer,
    component: BookViewList,
    initialize: booksActivated
};