let BookEntryList = require('./components/bookEntryList');
let reducer = require('./reducers/reducer');

BookEntryList = ReactRedux.connect(state => state.bookEntry)(BookEntryList);

module.exports = {
    name: 'scan',
    reducer: reducer,
    component: <BookEntryList />
};
