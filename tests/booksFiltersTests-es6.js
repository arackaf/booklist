const { toggleFilteredSubject, applyPendingFilteredSubjects, cancelPendingFilteredSubjects } = require('../react-redux/modules/bookList/actions/actionCreators');

const assert = require('chai').assert;
const { filtersReducer, filtersSelector } = require('../react-redux/modules/bookList/reducers/filtersReducer');

describe('subject stacking', function() {

    it('shouldStartOutWithEmptySubjectsAndPending', function(){
        let state = apply();
        assert.strictEqual(Object.keys(state.subjects).length, 0);
        assert.strictEqual(Object.keys(state.pendingSubjects).length, 0);
    });

    it('shouldToggle1Subject', function(){
        let state = apply(toggleFilteredSubject(1));
        assert.strictEqual(Object.keys(state.subjects).length, 0);
        assert.strictEqual(Object.keys(state.pendingSubjects).length, 1);
        assert.strictEqual(state.pendingSubjects[1], true);
    });

    it('shouldToggleAndUnToggle1Subject', function(){
        let state = apply(toggleFilteredSubject(1), toggleFilteredSubject(1));
        assert.strictEqual(Object.keys(state.subjects).length, 0);
        assert.strictEqual(Object.keys(state.pendingSubjects).length, 1);
        assert.strictEqual(state.pendingSubjects[1], false);
    });

    it('shouldToggle1SubjectAndApply', function(){
        let state = apply(toggleFilteredSubject(1), applyPendingFilteredSubjects());
        assert.strictEqual(Object.keys(state.subjects).length, 1);
        assert.strictEqual(Object.keys(state.pendingSubjects).length, 1);
        assert.strictEqual(state.subjects[1], true);
        assert.strictEqual(state.pendingSubjects[1], true);
    });

    it('shouldToggle1SubjectAndCancel', function(){
        let state = apply(toggleFilteredSubject(1), cancelPendingFilteredSubjects());
        assert.strictEqual(Object.keys(state.subjects).length, 0);
        assert.strictEqual(Object.keys(state.pendingSubjects).length, 0);
    });

});

function apply(...actions){
    let state = filtersReducer(undefined);
    actions.forEach(a => state = filtersReducer(state, a));

    return filtersSelector({ filters: state });
}