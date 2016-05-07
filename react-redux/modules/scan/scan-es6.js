let BookEntryList = require('./components/bookEntryList');
let reducer = require('./reducers/reducer');

BookEntryList = ReactRedux.connect(state => state.scan)(BookEntryList);

module.exports = {
    name: 'scan',
    reducer: reducer,
    component: BookEntryList
};
