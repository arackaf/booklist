const { updateIsbn, currentInputFinished, getBook, getBookResults, loadAndSaveBook, deleteBook, saveAllPending, resetList } = require('../react-redux/modules/bookEntry/actions/bookActionCreators');

global.Redux = require('../scripts/redux');
const assert = require('chai').assert;
const reducer = require('../react-redux/modules/bookEntry/reducers/bookEntryReducer');
const sinon = require('sinon');

const Redux = require('redux');
const thunkMiddleware = require('../react-redux/util/redux-thunk');

const bookLookupResults = {
    '123': { title: 'title 123' },
    '234': { failure: true }
};

var store;

const createStoreWithMiddleware = Redux.applyMiddleware(
    thunkMiddleware
)(Redux.createStore);

global.ajaxUtil = {
    post(){ }
};

describe('book entry tests', function(){

    beforeEach(function(){
        store = createStoreWithMiddleware(Redux.combineReducers({ bookEntry: reducer, x: () => ({}) }));
    });

    it('should get an initialized store', function(){
        assert.isTrue(Array.isArray(reducer(undefined).entryList));
    });

    it('should set isbn', function(){
        let state = applyToStore(updateIsbn('123', 0), updateIsbn('234', 1));
        assert.strictEqual(state.entryList[0].isbn, '123');
        assert.strictEqual(state.entryList[1].isbn, '234');
    });

    it('should get a book properly', function(){
        let state = applyToStore(updateIsbn('123', 0), updateIsbn('234', 1), getBook(1));
        checkBook({ isbn: '123', retrieving: undefined }, state.entryList[0]);
        checkBook({ isbn: '234', retrieving: true }, state.entryList[1]);
    });


    it('should get multiple books properly', function(){
        var mock = sinon.mock(ajaxUtil);

        mock.expects('post').withArgs(sinon.match.any, sinon.match({ isbn: '123' }));
        mock.expects('post').withArgs(sinon.match.any, sinon.match({ isbn: '234' }));
        mock.expects('post').withArgs(sinon.match.any, sinon.match({ isbn: '345' }));

        let state = applyToStore(updateIsbn('123', 1), updateIsbn('234', 5), updateIsbn('345', 2), saveAllPending());

        mock.verify();
        //checkBook({ fetchedTitle: 'title 123',  isbn: '123', retrieveFailure: undefined }, state.entryList[1]);
        //checkBook({ isbn: '234', retrieving: true }, state.entryList[1]);
    });


    function applyToStore(...actions){
        actions.forEach(a => store.dispatch(a));
        return store.getState().bookEntry;
    }

    function checkBook(bookProperties, bookInState){
        Object.keys(bookProperties).forEach(prop => assert.strictEqual(bookInState[prop], bookProperties[prop]));
    }
});