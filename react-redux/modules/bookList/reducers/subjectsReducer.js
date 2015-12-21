'use strict';

var marked0$0 = [flattenedSubjects].map(regeneratorRuntime.mark);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _require = require('../actions/actionNames');

var LOAD_SUBJECTS_RESULTS = _require.LOAD_SUBJECTS_RESULTS;
var EDIT_SUBJECT = _require.EDIT_SUBJECT;
var EDIT_SUBJECTS = _require.EDIT_SUBJECTS;
var SET_NEW_SUBJECT_NAME = _require.SET_NEW_SUBJECT_NAME;
var SET_NEW_SUBJECT_PARENT = _require.SET_NEW_SUBJECT_PARENT;
var STOP_EDITING_SUBJECTS = _require.STOP_EDITING_SUBJECTS;
var UPDATE_SUBJECT = _require.UPDATE_SUBJECT;
var UPDATE_SUBJECT_RESULTS = _require.UPDATE_SUBJECT_RESULTS;

var _require2 = require('../util/booksSubjectsHelpers');

var stackAndGetTopLevelSubjects = _require2.stackAndGetTopLevelSubjects;

var initialSubjectsState = function initialSubjectsState() {
    return {
        list: [],
        editSubjectsPacket: null
    };
};

function subjectsReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialSubjectsState() : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
        case LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { list: stackAndGetTopLevelSubjects(action.subjects) });
        case EDIT_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: { newSubjectName: '', newSubjectParent: '', editingSubjectId: '' } });
        case SET_NEW_SUBJECT_NAME:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectName: action.value }) });
        case SET_NEW_SUBJECT_PARENT:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectParent: action.value }) });
        case STOP_EDITING_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: null });
        case EDIT_SUBJECT:
            var editingSubject = Object.assign({}, [].concat(_toConsumableArray(flattenedSubjects(state.list))).find(function (s) {
                return s._id == action._id;
            })),
                newSubjectParent;

            var eligibleParents = [].concat(_toConsumableArray(flattenedSubjects(state.list))).filter(function (s) {
                return s._id !== action._id && !new RegExp(',' + action._id + ',').test(s.path);
            }).map(function (o) {
                return Object.assign({}, o);
            });

            if (editingSubject.path == null) {
                newSubjectParent = null;
            } else {
                var hierarchy = editingSubject.path.split(',');
                newSubjectParent = hierarchy[hierarchy.length - 2];
            }

            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectName: editingSubject.name, newSubjectParent: newSubjectParent, editingSubject: editingSubject, eligibleParents: eligibleParents }) });
        case UPDATE_SUBJECT_RESULTS:
            if ((action.existingParent || null) == (action.newParent || null)) {
                //parent's the same - update name and we're done
                var existingSubjects = [].concat(_toConsumableArray(flattenedSubjects(state.list))),
                    tweakedSubjects = existingSubjects.map(function (s) {
                    return s._id == action._id ? Object.assign({}, s, { name: action.newName }) : s;
                });

                return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { editingSubject: null }), list: stackAndGetTopLevelSubjects(tweakedSubjects) });
            } else {
                var _ret = (function () {
                    //not the most efficient code ... flatten all subjects, rip out those that were affected, re-stack
                    var existingSubjects = [].concat(_toConsumableArray(flattenedSubjects(state.list))),
                        affectedIds = action.affectedSubjects.map(function (s) {
                        return '' + s._id;
                    }),
                        tweakedSubjects = existingSubjects.map(function (s) {
                        return Object.assign({}, s);
                    }).filter(function (s) {
                        return affectedIds.indexOf('' + s._id) == -1;
                    });

                    return {
                        v: Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { editingSubject: null }), list: stackAndGetTopLevelSubjects(tweakedSubjects.concat(action.affectedSubjects)) })
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
    }
    return state;
}

function flattenedSubjects(subjects) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, subject;

    return regeneratorRuntime.wrap(function flattenedSubjects$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                context$1$0.prev = 3;
                _iterator = subjects[Symbol.iterator]();

            case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    context$1$0.next = 14;
                    break;
                }

                subject = _step.value;
                context$1$0.next = 9;
                return subject;

            case 9:
                if (!subject.children.length) {
                    context$1$0.next = 11;
                    break;
                }

                return context$1$0.delegateYield(flattenedSubjects(subject.children), 't0', 11);

            case 11:
                _iteratorNormalCompletion = true;
                context$1$0.next = 5;
                break;

            case 14:
                context$1$0.next = 20;
                break;

            case 16:
                context$1$0.prev = 16;
                context$1$0.t1 = context$1$0['catch'](3);
                _didIteratorError = true;
                _iteratorError = context$1$0.t1;

            case 20:
                context$1$0.prev = 20;
                context$1$0.prev = 21;

                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }

            case 23:
                context$1$0.prev = 23;

                if (!_didIteratorError) {
                    context$1$0.next = 26;
                    break;
                }

                throw _iteratorError;

            case 26:
                return context$1$0.finish(23);

            case 27:
                return context$1$0.finish(20);

            case 28:
            case 'end':
                return context$1$0.stop();
        }
    }, marked0$0[0], this, [[3, 16, 20, 28], [21,, 23, 27]]);
}

module.exports = { subjectsReducer: subjectsReducer };