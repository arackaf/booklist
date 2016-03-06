'use strict';

var _require = require('../../react-redux/modules/bookEntry/actions/actionCreators');

var updateIsbn = _require.updateIsbn;
var currentInputFinished = _require.currentInputFinished;
var getBook = _require.getBook;
var getBookResults = _require.getBookResults;
var loadAndSaveBook = _require.loadAndSaveBook;
var deleteBook = _require.deleteBook;
var saveAllPending = _require.saveAllPending;
var resetList = _require.resetList;

var Redux = require('redux');
var thunkMiddleware = require('../../react-redux/util/redux-thunk');
var sinon = require('sinon');
var assert = require('chai').assert;

var reducer = require('../../react-redux/modules/bookEntry/reducers/reducer');

var createStoreWithMiddleware = Redux.applyMiddleware(thunkMiddleware)(Redux.createStore);

var store;

global.ajaxUtil = {
    post: function post() {}
};

describe('book entry tests', function () {

    beforeEach(function () {
        store = createStoreWithMiddleware(Redux.combineReducers({ bookEntry: reducer, x: function x() {
                return {};
            } }));
    });

    it('should get an initialized store', function () {
        assert.isTrue(Array.isArray(reducer(undefined).entryList));
    });

    it('should set isbn', function () {
        var state = applyToStore(updateIsbn('123', 0), updateIsbn('234', 1));
        assert.strictEqual(state.entryList[0].isbn, '123');
        assert.strictEqual(state.entryList[1].isbn, '234');
    });

    it('should get a book properly', function () {
        var state = applyToStore(updateIsbn('123', 0), updateIsbn('234', 1), getBook(1));
        checkBook({ isbn: '123', retrieving: undefined }, state.entryList[0]);
        checkBook({ isbn: '234', retrieving: true }, state.entryList[1]);
    });

    it('should get and set multiple books properly', function () {
        var mock = sinon.mock(ajaxUtil);

        mock.expects('post').withArgs(sinon.match.any, sinon.match({ isbn: '123' })).callsArgWith(2, { title: 'title 123', isbn: '123' });
        mock.expects('post').withArgs(sinon.match.any, sinon.match({ isbn: '234' })).callsArgWith(2, { title: 'title 234', isbn: '234' });
        mock.expects('post').withArgs(sinon.match.any, sinon.match({ isbn: '345' })).callsArgWith(2, { title: 'title 345', isbn: '345' });

        var state = applyToStore(updateIsbn('123', 1), updateIsbn('234', 5), updateIsbn('345', 2), saveAllPending());

        mock.verify();
        checkBooks(state, {
            1: { fetchedTitle: 'title 123', isbn: '123', retrieveFailure: undefined },
            5: { fetchedTitle: 'title 234', isbn: '234', retrieveFailure: undefined },
            2: { fetchedTitle: 'title 345', isbn: '345', retrieveFailure: undefined }
        });
    });

    function applyToStore() {
        for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
            actions[_key] = arguments[_key];
        }

        actions.forEach(function (a) {
            return store.dispatch(a);
        });
        return store.getState().bookEntry;
    }

    function checkBooks(state, obj) {
        Object.keys(obj).forEach(function (index) {
            return checkBook(obj[index], state.entryList[index]);
        });
    }

    function checkBook(bookProperties, bookInState) {
        Object.keys(bookProperties).forEach(function (prop) {
            return assert.strictEqual(bookInState[prop], bookProperties[prop]);
        });
    }
});