const { LOAD_SUBJECTS_RESULTS, EDIT_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_NAME, SET_NEW_SUBJECT_PARENT, STOP_EDITING_SUBJECTS, UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS } = require('../actions/actionNames');

const { createSelector } = require('../../../util/reselect');
import { stackAndGetTopLevelSubjects, allSubjectsSorted } from '../util/booksSubjectsHelpers';

const initialSubjectsState = {
    subjectHash: {},
    editSubjectsPacket: null,
    loaded: false
};

function subjectsReducer(state = initialSubjectsState, action = {}){
    switch(action.type){
        case LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { subjectHash: subjectsToHash(action.subjects), loaded: true });
        case EDIT_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: { newSubjectName: '', newSubjectParent: '', editingSubjectId: '' } });
        case SET_NEW_SUBJECT_NAME:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectName: action.value }) });
        case SET_NEW_SUBJECT_PARENT:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectParent: action.value }) });
        case STOP_EDITING_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: null });
        case EDIT_SUBJECT:
            var editingSubject = state.subjectHash[action._id],
                newSubjectParent,
                eligibleParents = flattenedSubjects(state.subjectHash).filter(s => s._id !== action._id && (!new RegExp(`,${action._id},`).test(s.path)));

            if (editingSubject.path == null){
                newSubjectParent = null;
            } else {
                let hierarchy = editingSubject.path.split(',');
                newSubjectParent = hierarchy[hierarchy.length - 2];
            }

            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectName: editingSubject.name, newSubjectParent, editingSubject, eligibleParents }) });
        case UPDATE_SUBJECT_RESULTS:
            let changedSubjects = subjectsToHash(action.affectedSubjects);
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { editingSubject: null }), subjectHash: Object.assign({}, state.subjectHash, changedSubjects) });
    }
    return state;
}

function subjectsToHash(subjects){
    let hash = {};
    subjects.forEach(s => hash[s._id] = s);
    return hash;
}

function flattenedSubjects(subjects){
    return Object.keys(subjects).map(k => subjects[k]);
}

const stackedSubjectsSelector = createSelector(
    [state => state.subjectHash],
    subjectHash => ({
        list: stackAndGetTopLevelSubjects(subjectHash),
        allSubjectsSorted: allSubjectsSorted(subjectHash)
    })
);

const subjectsSelector = state => Object.assign({}, state.subjects, { ...stackedSubjectsSelector(state.subjects) });

module.exports = { subjectsReducer, subjectsSelector };