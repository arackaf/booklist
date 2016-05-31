'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actionNames = require('../actionNames');

var _utilBooksSubjectsHelpers = require('../../util/booksSubjectsHelpers');

var _require = require('react-redux-util/reselect');

var createSelector = _require.createSelector;

var initialSubjectsState = {
    subjectHash: {},
    editSubjectsPacket: null,
    loaded: false
};

function subjectsReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialSubjectsState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
        case _actionNames.LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { subjectHash: subjectsToHash(action.subjects), loaded: true });
        case _actionNames.EDIT_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: { newSubjectName: '', newSubjectParent: '', editingSubjectId: '' } });
        case _actionNames.SET_NEW_SUBJECT_NAME:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectName: action.value }) });
        case _actionNames.SET_NEW_SUBJECT_PARENT:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectParent: action.value }) });
        case _actionNames.STOP_EDITING_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: null });
        case _actionNames.NEW_SUBJECT:
            var eligibleParents = flattenedSubjects(state.subjectHash);

            return Object.assign({}, state, { editSubjectsPacket: { editing: true, newSubjectName: '', newSubjectParent: '', editingSubject: null, eligibleParents: eligibleParents } });
        case _actionNames.EDIT_SUBJECT:
            var editingSubject = state.subjectHash[action._id],
                newSubjectParent,
                eligibleParents = flattenedSubjects(state.subjectHash).filter(function (s) {
                return s._id !== action._id && !new RegExp(',' + action._id + ',').test(s.path);
            });

            if (editingSubject.path == null) {
                newSubjectParent = null;
            } else {
                var hierarchy = editingSubject.path.split(',');
                newSubjectParent = hierarchy[hierarchy.length - 2];
            }

            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { editing: true, newSubjectName: editingSubject.name, newSubjectParent: newSubjectParent || '', editingSubject: editingSubject, eligibleParents: eligibleParents }) });
        case _actionNames.UPDATE_SUBJECT_RESULTS:
            var changedSubjects = subjectsToHash(action.affectedSubjects);
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { editing: false, editingSubject: null }), subjectHash: Object.assign({}, state.subjectHash, changedSubjects) });
        case _actionNames.SUBJECT_DELETED:
            var editSubjectsPacket = Object.assign({}, state.editSubjectsPacket, { editing: false });
            var subjectHash = _extends({}, state.subjectHash);
            delete subjectHash[action.subjectId];

            return Object.assign({}, state, { editSubjectsPacket: editSubjectsPacket, subjectHash: subjectHash });
    }
    return state;
}

function subjectsToHash(subjects) {
    var hash = {};
    subjects.forEach(function (s) {
        return hash[s._id] = s;
    });
    return hash;
}

function flattenedSubjects(subjects) {
    return Object.keys(subjects).map(function (k) {
        return subjects[k];
    });
}

var stackedSubjectsSelector = createSelector([function (state) {
    return state.subjectHash;
}], function (subjectHash) {
    return {
        list: (0, _utilBooksSubjectsHelpers.stackAndGetTopLevelSubjects)(subjectHash),
        allSubjectsSorted: (0, _utilBooksSubjectsHelpers.allSubjectsSorted)(subjectHash)
    };
});

var subjectsSelector = function subjectsSelector(state) {
    return Object.assign({}, state.subjects, _extends({}, stackedSubjectsSelector(state.subjects)));
};

module.exports = { subjectsReducer: subjectsReducer, subjectsSelector: subjectsSelector };