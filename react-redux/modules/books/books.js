import BookViewList from './components/bookViewList';
import { reducer, selector } from './reducers/reducer';
import { syncFiltersToHash } from './reducers/bookSearch/actionCreators'
import { booksActivated } from './reducers/bookSearch/actionCreators'

export default {
    name: 'books',
    reducer: reducer,
    component: BookViewList,
    initialize: booksActivated
};