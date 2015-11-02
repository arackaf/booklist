let BookEntryList = require('./components/bookEntryList'),
    renderUI = require('../../applicationRoot/renderUI');

let { store, getNewReducer } = require('/react/store');
let reducer = require('./reducers/bookEntryReducer');

getNewReducer({ name: 'bookEntry', reducer });
BookEntryList = ReactRedux.connect(state => state.bookEntry)(BookEntryList);

renderUI(<BookEntryList count="10" />);