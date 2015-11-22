let BookEntryList = require('./components/bookEntryList');
let reducer = require('./reducers/reducer');

BookEntryList = ReactRedux.connect(state => state.bookEntry)(BookEntryList);

module.exports = {
    name: 'bookEntry',
    reducer: reducer,
    component: <BookEntryList count="10" />
};
