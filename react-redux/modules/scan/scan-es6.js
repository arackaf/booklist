let BookEntryList = require('./components/bookEntryList');
let reducer = require('./reducers/reducer');

BookEntryList = ReactRedux.connect(state => state.scan)(BookEntryList);

export default {
    name: 'scan',
    reducer: reducer,
    component: BookEntryList
};
