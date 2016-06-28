import {
    LOAD_SUBJECTS_RESULTS, EDIT_SUBJECT, NEW_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_NAME, SET_NEW_SUBJECT_PARENT,
    STOP_EDITING_SUBJECTS, UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS, SUBJECT_DELETED, LOAD_COLORS, SET_NEW_SUBJECT_BG_COLOR
} from './actionNames';

const { createSelector } = require('reselect');
import { stackAndGetTopLevelSubjects, allSubjectsSorted } from '../../util/booksSubjectsHelpers';

const initialSubjectsState = {
    subjectHash: {},
    editSubjectsPacket: null,
    colors: [],
    loaded: false
};

export function subjectsReducer(state = initialSubjectsState, action = {}){
    switch(action.type){
        case LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { subjectHash: subjectsToHash(action.subjects), loaded: true });
        case EDIT_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: { newSubjectName: '', newSubjectParent: '', editingSubjectId: '' } });
        case SET_NEW_SUBJECT_NAME:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectName: action.value }) });
        case SET_NEW_SUBJECT_PARENT:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectParent: action.value }) });
        case SET_NEW_SUBJECT_BG_COLOR:
            return Object.assign({}, state, { editSubjectsPacket: { ...state.editSubjectsPacket, newBackgroundColor: action.color } });
        case STOP_EDITING_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: null });
        case NEW_SUBJECT:
            var eligibleParents = flattenedSubjects(state.subjectHash);

            return Object.assign({}, state, { editSubjectsPacket: { editing: true, newSubjectName: '', newSubjectParent: '', newBackgroundColor: '', newTextColor: '', editingSubject: null, eligibleParents } });
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

            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { editing: true, newSubjectName: editingSubject.name, newSubjectParent: newSubjectParent || '', newBackgroundColor: '', newTextColor: '', editingSubject, eligibleParents }) });
        case UPDATE_SUBJECT_RESULTS:
            let changedSubjects = subjectsToHash(action.affectedSubjects);
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { editing: false, editingSubject: null }), subjectHash: Object.assign({}, state.subjectHash, changedSubjects) });
        case SUBJECT_DELETED:
            let editSubjectsPacket = Object.assign({}, state.editSubjectsPacket, { editing: false });
            let subjectHash = { ...state.subjectHash };
            delete subjectHash[action.subjectId];

            return Object.assign({}, state, { editSubjectsPacket, subjectHash });
        case LOAD_COLORS:
            return Object.assign({}, state, { colors: action.colors });
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

export const subjectsSelector = state => Object.assign({}, state.subjects, { ...stackedSubjectsSelector(state.subjects) });
