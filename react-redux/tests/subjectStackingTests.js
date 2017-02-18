'use strict';

var _marked = [flattenAllSubjects].map(regeneratorRuntime.mark);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('../../react-redux/modules/books/reducers/actionNames'),
    LOAD_SUBJECTS_RESULTS = _require.LOAD_SUBJECTS_RESULTS,
    EDIT_SUBJECT = _require.EDIT_SUBJECT,
    UPDATE_SUBJECT = _require.UPDATE_SUBJECT,
    UPDATE_SUBJECT_RESULTS = _require.UPDATE_SUBJECT_RESULTS;

var assert = require('chai').assert;

var _require2 = require('../../react-redux/modules/books/reducers/reducer'),
    reducer = _require2.reducer,
    selector = _require2.selector;

describe('subject stacking', function () {

    it('should stack a flat list', function () {
        var subjects = loadSubjects([{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }]);
        verifySubjects(subjects, [{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }]);
    });

    it('should stack list with one child', function () {
        var subjects = loadSubjects([{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c', path: ',2,' }]);
        verifySubjects(subjects, [{ _id: 1, name: 'a' }, { _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }] }]);
    });

    it('should stack 3 deep', function () {
        var subjects = loadSubjects([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }]);
        verifySubjects(subjects, [{ _id: 1, name: 'a', children: [{ _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }] }] }]);
    });

    it('should stack 3 deep with peers', function () {
        var subjects = loadSubjects([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }, { _id: 22, name: 'b2', path: ',1,' }, { _id: 32, name: 'c2', path: ',1,2,' }]);
        verifySubjects(subjects, [{ _id: 1, name: 'a', children: [{ _id: 22, name: 'b2' }, { _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }, { _id: 32, name: 'c2' }] }] }]);
    });

    it('should flatten nested subjects properly', function () {
        //testing a test utility
        var flattened = [].concat(_toConsumableArray(flattenAllSubjects([{ _id: 1, name: 'a', children: [{ _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }] }] }])));
        verifySubjects(flattened, [{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }]);
    });

    it('should flatten nested subjects properly 2', function () {
        var flattened = [].concat(_toConsumableArray(flattenAllSubjects([{ _id: 1, name: 'a', children: [{ _id: 22, name: 'b2' }, { _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }, { _id: 32, name: 'c2' }] }] }])));
        verifySubjects(flattened, [{ _id: 1, name: 'a' }, { _id: 22, name: 'b2' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }, { _id: 32, name: 'c2' }]);
    });
});

describe('Subject filtering for editing', function () {
    it('Should not let you set yourself as the new parent', function () {
        var subjects = loadSubjectsAndEdit([{ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, name: 'c' }], 1);
        verifySubjects(subjects, [{ _id: 2, name: 'b' }, { _id: 3, name: 'c' }]);
    });

    it('Should not let you set a child as the new parent', function () {
        var subjects = loadSubjectsAndEdit([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c' }], 1);
        verifySubjects(subjects, [{ _id: 3, name: 'c' }]);
    });

    it('Should let you set the current parent as the new parent', function () {
        var subjects = loadSubjectsAndEdit([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c' }], 2);
        verifySubjects(subjects, [{ _id: 3, name: 'c' }, { _id: 3, name: 'c' }]);
    });

    it('Should let you set a sibling as the new parent', function () {
        var subjects = loadSubjectsAndEdit([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 22, name: 'ba', path: ',1,' }, { _id: 3, name: 'c' }], 2);
        verifyTopLevelSubjectsOnly(subjects, [{ _id: 1, name: 'a' }, { _id: 3, name: 'c' }, { _id: 22, name: 'ba' }]);
    });

    it('Should not let you set the current parent as the new parent', function () {
        var subjects = loadSubjectsAndEdit([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 22, name: 'ba', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }], 3);
        verifyTopLevelSubjectsOnly(subjects, [{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 22, name: 'ba' }]);
    });
});

describe('Subject updating', function () {
    it('should update simple name with 3 deep 1', function () {
        var subjects = loadSubjectsThenUpdate([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }, { _id: 22, name: 'b2', path: ',1,' }, { _id: 32, name: 'c2', path: ',1,2,' }], {
            affectedSubjects: [{ _id: 1, name: 'a2' }]
        });
        verifySubjects(subjects, [{ _id: 1, name: 'a2', children: [{ _id: 22, name: 'b2' }, { _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }, { _id: 32, name: 'c2' }] }] }], 'top level');
    });

    it('should update simple name with 3 deep 2', function () {
        var subjects = loadSubjectsThenUpdate([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }, { _id: 22, name: 'b2', path: ',1,' }, { _id: 32, name: 'c2', path: ',1,2,' }], {
            affectedSubjects: [{ _id: 2, name: 'bA', path: ',1,' }]
        });
        verifySubjects(subjects, [{ _id: 1, name: 'a', children: [{ _id: 22, name: 'b2' }, { _id: 2, name: 'bA', children: [{ _id: 3, name: 'c' }, { _id: 32, name: 'c2' }] }] }], 'top level');
    });

    it('should update simple name with 3 deep 3', function () {
        var subjects = loadSubjectsThenUpdate([{ _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }, { _id: 22, name: 'b2', path: ',1,' }, { _id: 32, name: 'c2', path: ',1,2,' }], {
            affectedSubjects: [{ _id: 3, name: 'cA', path: ',1,2,' }]
        });
        verifySubjects(subjects, [{ _id: 1, name: 'a', children: [{ _id: 22, name: 'b2' }, { _id: 2, name: 'b', children: [{ _id: 3, name: 'cA' }, { _id: 32, name: 'c2' }] }] }], 'top level');
    });

    it('should update parent with 3 deep 1', function () {
        var subjects = loadSubjectsThenUpdate([{ _id: 99, name: '99' }, { _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }, { _id: 22, name: 'b2', path: ',1,' }, { _id: 32, name: 'c2', path: ',1,2,' }], {
            affectedSubjects: [{ _id: 2, name: 'b2', path: ',99,' }, { _id: 3, name: 'c', path: ',99,2,' }, { _id: 32, name: 'c2', path: ',99,2,' }],
            _id: 2,
            newName: 'b2',
            newParent: 99
        });
        verifySubjects(subjects, [{ _id: 99, name: '99', children: [{ _id: 2, name: 'b2', children: [{ _id: 3, name: 'c' }, { _id: 32, name: 'c2' }] }] }, { _id: 1, name: 'a', children: [{ _id: 22, name: 'b2' }] }], 'top level');
    });

    it('should update parent with 3 deep 2', function () {
        var subjects = loadSubjectsThenUpdate([{ _id: 99, name: '99' }, { _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }, { _id: 22, name: 'b2', path: ',1,' }, { _id: 32, name: 'c2', path: ',1,2,' }], {
            affectedSubjects: [{ _id: 2, name: 'b2', path: null }, { _id: 3, name: 'c', path: ',99,2,' }, { _id: 32, name: 'c2', path: ',99,2,' }],
            _id: 2,
            newName: 'b2',
            newParent: null
        });
        verifySubjects(subjects, [{ _id: 2, name: 'b2', children: [{ _id: 3, name: 'c' }, { _id: 32, name: 'c2' }] }, { _id: 99, name: '99', children: [] }, { _id: 1, name: 'a', children: [{ _id: 22, name: 'b2' }] }], 'top level');
    });

    it('should update parent with 3 deep 3', function () {
        var subjects = loadSubjectsThenUpdate([{ _id: 99, name: '99' }, { _id: 1, name: 'a' }, { _id: 2, name: 'b', path: ',1,' }, { _id: 3, name: 'c', path: ',1,2,' }, { _id: 22, name: 'b2', path: ',1,' }, { _id: 32, name: 'c2', path: ',1,2,' }], {
            affectedSubjects: [{ _id: 99, name: '99a', path: ',1,2,32,' }],
            _id: 99,
            newName: '99a',
            newParent: 32
        });
        verifySubjects(subjects, [{ _id: 1, name: 'a', children: [{ _id: 22, name: 'b2' }, { _id: 2, name: 'b', children: [{ _id: 3, name: 'c' }, { _id: 32, name: 'c2', children: [{ _id: 99, name: '99a' }] }] }] }], 'top level');
    });
});

function loadSubjectsAndEdit(subjects, _id) {
    return apply({ type: LOAD_SUBJECTS_RESULTS, subjects: subjects }, { type: EDIT_SUBJECT, _id: _id }).subjects.editSubjectPacket.eligibleParents;
}

function loadSubjectsThenUpdate(subjects, info) {
    return apply({ type: LOAD_SUBJECTS_RESULTS, subjects: subjects }, { type: UPDATE_SUBJECT_RESULTS, _id: info._id, newName: info.newName, newParent: info.newParent, affectedSubjects: info.affectedSubjects }).subjects.list;
}

function loadSubjects(subjects) {
    return apply({ type: LOAD_SUBJECTS_RESULTS, subjects: subjects }).subjects.list;
}

function apply() {
    var state = reducer(undefined, {});

    for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
        actions[_key] = arguments[_key];
    }

    actions.forEach(function (a) {
        return state = reducer(state, a);
    });

    return selector({ books: state });
}

function verifyTopLevelSubjectsOnly(actual, expected) {
    assert.strictEqual(actual.length, expected.length, 'Top level subjects dont match');

    expected.forEach(function (se) {
        var matchingSubject = actual.find(function (sa) {
            return se._id == sa._id && se.name == sa.name;
        });
        assert.isObject(matchingSubject, 'subject not found ' + se._id + ' ' + se.name);
    });
}

function verifySubjects(actual, expected, msg) {
    assert.strictEqual(actual.length, expected.length, msg);

    expected.forEach(function (se) {
        var matchingSubject = actual.find(function (sa) {
            return se._id == sa._id && se.name == sa.name;
        });
        assert.isObject(matchingSubject, 'subject not found ' + se._id + ' ' + se.name);
        verifySubjects(matchingSubject.children || [], se.children || [], 'Checking children of ' + matchingSubject.name); //I don't feel like adding children to every test object
    });
}

function flattenAllSubjects(subjects) {
    var i;
    return regeneratorRuntime.wrap(function flattenAllSubjects$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    i = 0;

                case 1:
                    if (!(i < subjects.length)) {
                        _context.next = 10;
                        break;
                    }

                    if (!subjects[i].children) {
                        _context.next = 4;
                        break;
                    }

                    return _context.delegateYield(flattenAllSubjects(subjects[i].children), 't0', 4);

                case 4:
                    subjects[i].children = [];
                    _context.next = 7;
                    return subjects[i];

                case 7:
                    i++;
                    _context.next = 1;
                    break;

                case 10:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}