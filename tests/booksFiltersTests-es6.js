const { LOAD_SUBJECTS_RESULTS, EDIT_SUBJECT, UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS } = require('../react-redux/modules/bookList/actions/actionNames');

const assert = require('chai').assert;
const { filtersReducer, filtersSelector } = require('../react-redux/modules/bookList/reducers/filtersReducer');

describe('subject stacking', function() {

    it('shouldStartOutWithEmptySubjectsAndPending', function(){
        let state = apply();
        assert.strictEqual(Object.keys(state.subjects).length, 0);
        assert.strictEqual(Object.keys(state.pendingSubjects).length, 0);
    });

});

function apply(...actions){
    let state = filtersReducer(undefined);
    actions.forEach(a => state = filtersReducer(state, a));

    return filtersSelector({ filters: state });
}