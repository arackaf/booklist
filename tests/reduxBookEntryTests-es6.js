const { updateIsbn, currentInputFinished, getBook, getBookResults, loadAndSaveBook, deleteBook, saveAllPending, resetList } = require('../react-redux/modules/bookEntry/actions/bookActionCreators');

global.Redux = require('../scripts/redux');
const assert = require('chai').assert;
const reducer = require('../react-redux/modules/bookEntry/reducers/bookEntryReducer');

describe('book entry tests', function(){

    it('should get an initialized store', function(){
        assert.isTrue(Array.isArray(reducer(undefined).entryList));
    });

    it('should accept dispatches', function(){
        let initState = reducer(undefined);
        let state = reducer(initState, updateIsbn('123', initState.entryList[0]));
        assert.strictEqual(state.entryList[0].isbn, '123');
    });

});