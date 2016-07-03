import {
    LOAD_SUBJECTS_RESULTS, EDIT_SUBJECT, NEW_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_VALUE,
    STOP_EDITING_SUBJECTS, UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS, LOAD_COLORS, CANCEL_SUBJECT_EDIT,
    BEGIN_SUBJECT_DELETE, CANCEL_SUBJECT_DELETE, SUBJECT_DELETING, SUBJECT_DELETED
} from './actionNames';

const { createSelector } = require('reselect');
import { stackAndGetTopLevelSubjects, allSubjectsSorted } from '../../util/booksSubjectsHelpers';

const initialSubjectsState = {
    subjectHash: {},
    editSubjectPacket: null,
    colors: [],
    loaded: false
};

export function subjectsReducer(state = initialSubjectsState, action = {}){
    switch(action.type){
        case LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { subjectHash: subjectsToHash(action.subjects), loaded: true });
        case EDIT_SUBJECTS:
            return Object.assign({}, state, { editSubjectPacket: {  } });
        case SET_NEW_SUBJECT_VALUE:
            return Object.assign({}, state, { editSubjectPacket: { ...state.editSubjectPacket, [action.field]: action.value } });
        case STOP_EDITING_SUBJECTS:
            return Object.assign({}, state, { editSubjectPacket: null });
        case NEW_SUBJECT:
            var eligibleParents = flattenedSubjects(state.subjectHash);

            return Object.assign({}, state, { editSubjectPacket: { editing: true, editingSubject: null, eligibleParents, parentId: '', name: '' } });
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

            return Object.assign({}, state, { editSubjectPacket: { editing: true, ...editingSubject, parentId: parentId || '', editingSubject, eligibleParents } });
        case CANCEL_SUBJECT_EDIT:
            return Object.assign({}, state, { editSubjectPacket: { ...state.editSubjectPacket, editing: false } });
        case UPDATE_SUBJECT_RESULTS:
            let changedSubjects = subjectsToHash(action.affectedSubjects);
            return Object.assign({}, state, { editSubjectPacket: Object.assign({}, state.editSubjectPacket, { editing: false, editingSubject: null }), subjectHash: Object.assign({}, state.subjectHash, changedSubjects) });
        case BEGIN_SUBJECT_DELETE:
            let childSubjectRegex = new RegExp(`.*,${action._id},.*`),
                affectedChildren = Object.keys(state.subjectHash).filter(k => childSubjectRegex.test(state.subjectHash[k].path)).length,
                subjectName = state.subjectHash[action._id].name;

            return Object.assign({}, state, { editSubjectPacket: { ...state.editSubjectPacket, deleteInfo: { affectedChildren, subjectName, _id: action._id } } });
        case CANCEL_SUBJECT_DELETE:
            return Object.assign({}, state, { editSubjectPacket: { ...state.editSubjectPacket, deleteInfo: null } });
        case SUBJECT_DELETING:
            return Object.assign({}, state, { editSubjectPacket: { ...state.editSubjectPacket, deleteInfo: { ...state.editSubjectPacket.deleteInfo, deleting: true } } });
        case SUBJECT_DELETED:
            let editSubjectPacket = Object.assign({}, state.editSubjectPacket, { editing: false });
            let subjectHash = { ...state.subjectHash };

            action.subjectsDeleted.forEach(_id => delete subjectHash[_id]);

            return Object.assign({}, state, { editSubjectPacket, subjectHash });
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
        subjects: stackAndGetTopLevelSubjects(subjectHash),
        allSubjectsSorted: allSubjectsSorted(subjectHash)
    })
);

export const subjectsSelector = state => Object.assign({}, state.subjects, { ...stackedSubjectsSelector(state.subjects) });
