'use strict';

var _require = require('../react-redux/modules/bookList/actions/actionNames');

var LOAD_SUBJECTS_RESULTS = _require.LOAD_SUBJECTS_RESULTS;
var EDIT_SUBJECT = _require.EDIT_SUBJECT;
var UPDATE_SUBJECT = _require.UPDATE_SUBJECT;
var UPDATE_SUBJECT_RESULTS = _require.UPDATE_SUBJECT_RESULTS;

var assert = require('chai').assert;

var _require2 = require('../react-redux/modules/bookList/reducers/filtersReducer');

var filtersReducer = _require2.filtersReducer;
var filtersSelector = _require2.filtersSelector;

describe('subject stacking', function () {

    it('shouldStartOutWithEmptySubjectsAndPending', function () {
        var state = apply();
        assert.strictEqual(Object.keys(state.subjects).length, 0);
        assert.strictEqual(Object.keys(state.pendingSubjects).length, 0);
    });
});

function apply() {
    var state = filtersReducer(undefined);

    for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
        actions[_key] = arguments[_key];
    }

    actions.forEach(function (a) {
        return state = filtersReducer(state, a);
    });

    return filtersSelector({ filters: state });
}