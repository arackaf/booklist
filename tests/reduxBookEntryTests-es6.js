const { updateIsbn, currentInputFinished, getBook, getBookResults, loadAndSaveBook, deleteBook, saveAllPending, resetList } = require('../react-redux/modules/bookEntry/actions/bookActionCreators');

global.Redux = require('../scripts/redux');
const assert = require('chai').assert;
const reducer = require('../react-redux/modules/bookEntry/reducers/bookEntryReducer');

describe('book entry tests', function(){

    it('should get an initialized store', function(){
        assert.isTrue(Array.isArray(reducer(undefined).entryList));
    });

    it('should accept dispatches', function(){
        let state = applyToReducer(updateIsbn('123', 0), updateIsbn('234', 1));
        assert.strictEqual(state.entryList[0].isbn, '123');
        assert.strictEqual(state.entryList[1].isbn, '234');
    });


    function applyToReducer(...actions){
        let state = reducer();
        actions.forEach(a => state = reducer(state, a));
        return state;
    }
});