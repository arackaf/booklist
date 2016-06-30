import {
    LOAD_SUBJECTS_RESULTS, EDIT_SUBJECT, NEW_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_VALUE,
    STOP_EDITING_SUBJECTS, UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS, SUBJECT_DELETED, LOAD_COLORS, CANCEL_SUBJECT_EDIT
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
            return Object.assign({}, state, { editSubjectsPacket: {  } });
        case SET_NEW_SUBJECT_VALUE:
            return Object.assign({}, state, { editSubjectsPacket: { ...state.editSubjectsPacket, [action.field]: action.value } });
        case STOP_EDITING_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: null });
        case NEW_SUBJECT:
            var eligibleParents = flattenedSubjects(state.subjectHash);

            return Object.assign({}, state, { editSubjectsPacket: { editing: true, editingSubject: null, eligibleParents, parentId: '', name: '' } });
        case EDIT_SUBJECT:
            var editingSubject = state.subjectHash[action._id],
                parentId,
                eligibleParents = flattenedSubjects(state.subjectHash).filter(s => s._id !== action._id && (!new RegExp(`,${action._id},`).test(s.path)));

            if (editingSubject.path == null){
                parentId = null;
            } else {
                let hierarchy = editingSubject.path.split(',');
                parentId = hierarchy[hierarchy.length - 2];
            }

            return Object.assign({}, state, { editSubjectsPacket: { editing: true, ...editingSubject, parentId: parentId || '', editingSubject, eligibleParents } });
        case CANCEL_SUBJECT_EDIT:
            return Object.assign({}, state, { editSubjectsPacket: { ...state.editSubjectsPacket, editing: false } });
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
