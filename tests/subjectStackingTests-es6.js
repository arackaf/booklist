const { updateIsbn, currentInputFinished, getBook, getBookResults, loadAndSaveBook, deleteBook, saveAllPending, resetList } = require('../react-redux/modules/bookList/actions/actionCreators');

const { LOAD_SUBJECTS_RESULTS } = require('../react-redux/modules/bookList/actions/actionNames');

const Redux = require('redux');
const sinon = require('sinon');
const assert = require('chai').assert;

const reducer = require('../react-redux/modules/bookList/reducers/reducer');

describe('subject stacking', function() {

    it('should stack a flat list', function () {
        let subjects = loadSubjects([{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }]);
        verifySubjects(subjects, [{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }]);
    });

    it('should stack list with one child', function () {
        let subjects = loadSubjects([{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c', path: ',2,' }]);
        verifySubjects(subjects, [{ _id: 1, name: 'a' }, { _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }] }]);
    });

    it('should stack 3 deep', function () {
        let subjects = loadSubjects([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }]);
        verifySubjects(subjects, [{ _id: 1, name: 'a', children: [{ _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }] }] }]);
    });

    it('should stack 3 deep with peers', function () {
        let subjects = loadSubjects([
            { _id: 1, name: 'a' },
            { _id: 2, name: 'b', path: ',1,' },
            { _id: 3, name: 'c', path: ',1,2,' },
            { _id: 22, name: 'b2', path: ',1,' },
            { _id: 32, name: 'c2', path: ',1,2,' }
        ]);
        verifySubjects(subjects, [
            { _id: 1, name: 'a', children: [{ _id: 22, name: 'b2' }, { _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }, { _id: 32, name: 'c2' }] }] }]);
    });

    function loadSubjects(subjects){
        return apply({ type: LOAD_SUBJECTS_RESULTS, subjects }).subjects;
    }

    function apply(...actions){
        let state = reducer(undefined);
        actions.forEach(a => state = reducer(state, a));
        return state;
    }

    function verifySubjects(actual, expected){
        assert.strictEqual(actual.length, expected.length, 'Top level subjects dont match');

        expected.forEach(se => {
            let matchingSubject = actual.find(sa => se._id == sa._id && se.name == sa.name);
            assert.isObject(matchingSubject, `subject not found ${se._id} ${se.name}`);
            verifySubjects(matchingSubject.children, se.children || []); //I don't feel like adding children to every test object
        });
    }
});