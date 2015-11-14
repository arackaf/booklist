global.Redux = require('../scripts/redux');
const assert = require('chai').assert;
const { store, getNewReducer } = require('../react-redux/applicationRoot/store');
const reducer = require('../react-redux/modules/bookEntry/reducers/bookEntryReducer');

getNewReducer({ name: 'bookEntry', reducer: reducer });

describe('book entry tests', function(){

    it('should pass', function(){
        assert.isTrue(Array.isArray(store.getState().bookEntry.entryList));
    })

});