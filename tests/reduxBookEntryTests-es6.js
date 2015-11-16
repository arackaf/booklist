const { updateIsbn, currentInputFinished, getBook, getBookResults, loadAndSaveBook, deleteBook, saveAllPending, resetList } = require('../react-redux/modules/bookEntry/actions/bookActionCreators');

global.Redux = require('../scripts/redux');
const assert = require('chai').assert;
const reducer = require('../react-redux/modules/bookEntry/reducers/bookEntryReducer');

const bookLookupResults = {
    '123': { title: 'title 123' },
    '234': { failure: true }
};

global.ajaxUtil = {
    post(url, data, callback){
        callback(bookLookupResults[data.isbn]);
    }
};

describe('book entry tests', function(){

    it('should get an initialized store', function(){
        assert.isTrue(Array.isArray(reducer(undefined).entryList));
    });

    it('should set isbn', function(){
        let state = applyToReducer(updateIsbn('123', 0), updateIsbn('234', 1));
        assert.strictEqual(state.entryList[0].isbn, '123');
        assert.strictEqual(state.entryList[1].isbn, '234');
    });

    it('should get a book properly', function(){
        let state = applyToReducer(updateIsbn('123', 0), updateIsbn('234', 1), getBook(1));
        checkBook({ isbn: '123', retrieving: undefined }, state.entryList[0]);
        checkBook({ isbn: '234', retrieving: true }, state.entryList[1]);
    });

    it('should get multiple books properly', function(){
        let state = applyToReducer(updateIsbn('123', 1), updateIsbn('234', 5), updateIsbn('345', 2), saveAllPending());
        //checkBook({ fetchedTitle: 'title 123',  isbn: '123', retrieveFailure: undefined }, state.entryList[1]);
        //checkBook({ isbn: '234', retrieving: true }, state.entryList[1]);
    });


    function applyToReducer(...actions){
        let state = reducer();
        actions.forEach(a => state = reducer(state, a));
        return state;
    }

    function checkBook(bookProperties, bookInState){
        Object.keys(bookProperties).forEach(prop => assert.strictEqual(bookInState[prop], bookProperties[prop]));
    }
});