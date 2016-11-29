import {createSelector} from 'reselect';

import {stackAndGetTopLevelSubjects, subjectsSelector, getEligibleParents, topLevelSubjectsSortedSelector} from 'applicationRoot/rootReducer';
import {removeKeysFromObject} from 'util/immutableHelpers';

import {
    ADD_NEW_SUBJECT,
    BEGIN_SUBJECT_EDIT,
    SET_EDITING_SUBJECT_FIELD,
    SUBJECTS_SAVING,
    CLEAR_SAVING_STATE,
    CANCEL_SUBJECT_EDIT,

    BEGIN_PENDNIG_DELETE,
    CANCEL_PENDNIG_DELETE,
    DELETING_SUBJECTS,
    DONE_DELETING_SUBJECTS,
    SUBJECT_DRAGGING_OVER
} from './actionNames';

const initialSubjectsState = {
    draggingId: null,
    currentDropCandidateId: null,
    pendingSubjectsHash: {},
    pendingDeleteHash: {},
    deletingHash: {},
    editingSubjectsHash: {},
    subjectsSaving: {},
    subjectsSaved: {}
};

export function reducer(state = initialSubjectsState, action){
    switch(action.type){
        case ADD_NEW_SUBJECT:
            return {
                ...state,
                pendingSubjectsHash: {...state.pendingSubjectsHash, [action.subject._id]: action.subject},
                editingSubjectsHash: {...state.editingSubjectsHash, [action.subject._id]: action.subject}
            };

        case BEGIN_SUBJECT_EDIT:
            return {...state, editingSubjectsHash: {...state.editingSubjectsHash, [action._id]: action.subject}}
        case CANCEL_SUBJECT_EDIT:
            return {
                ...state,
                editingSubjectsHash: removeKeysFromObject(state.editingSubjectsHash, [action._id]),
                pendingSubjectsHash: removeKeysFromObject(state.pendingSubjectsHash, [action._id])
            };

        case BEGIN_PENDNIG_DELETE:
            return {...state, pendingDeleteHash: {...state.pendingDeleteHash, [action._id]: true}};
        case CANCEL_PENDNIG_DELETE:
            return {...state, pendingDeleteHash: removeKeysFromObject(state.pendingDeleteHash, [action._id]) };
        case DELETING_SUBJECTS:
            return {...state, deletingHash: {...state.deletingHash, ...action.subjects }};
        case DONE_DELETING_SUBJECTS:
            return {
                ...state,
                pendingDeleteHash: removeKeysFromObject(state.pendingDeleteHash, Object.keys(action.subjects)),
                deletingHash: removeKeysFromObject(state.deletingHash, Object.keys(action.subjects))
            };
        case SUBJECT_DRAGGING_OVER:
            return { ...state, draggingId: action.sourceId, currentDropCandidateId: action.targetId };
        case SUBJECTS_SAVING:
            return {...state, subjectsSaving: {...state.subjectsSaving, ...action.subjects}};
        case CLEAR_SAVING_STATE:
            return {
                ...state,
                subjectsSaved: removeKeysFromObject(state.subjectsSaved, Object.keys(action.subjects)),
                subjectsSaving: removeKeysFromObject(state.subjectsSaving, Object.keys(action.subjects)),
                editingSubjectsHash: removeKeysFromObject(state.editingSubjectsHash, Object.keys(action.subjects)),
                pendingSubjectsHash: removeKeysFromObject(state.pendingSubjectsHash, Object.keys(action.subjects))
            };
        case SET_EDITING_SUBJECT_FIELD:
            return {
                ...state,
                editingSubjectsHash: {...state.editingSubjectsHash, [action._id]: {...state.editingSubjectsHash[action._id], [action.field]: action.value}}
            };

    }
    return state;
}

export const editingSubjectHashSelector = createSelector([
    state => state.app.subjectHash,
    state => state.subjectsModule.editingSubjectsHash
], (subjectHash, editingSubjectsHash) => {
    return {
        editingSubjectsHash: Object.keys(editingSubjectsHash)
                                   .map(_id => editingSubjectsHash[_id])
                                   .reduce((hash, s) => (hash[s._id] = {...s, eligibleParents: getEligibleParents(subjectHash, s._id)}, hash), {})
    };
});

const tempSubjectCompare = ({_id: id1}, {_id: id2}) => id1 - id2;

export const pendingSubjectsSelector = createSelector([
    state => state.subjectsModule.pendingSubjectsHash
], pendingSubjectsHash => {
    let result = {};
    Object.keys(pendingSubjectsHash).forEach(_id => {
        let subject = pendingSubjectsHash[_id],
            resultKey = subject.parentId || 'root';

        if (!result[resultKey]){
            result[resultKey] = [];
        }
        result[resultKey].push(subject);
    });
    Object.keys(result).forEach(parentId => result[parentId].sort(tempSubjectCompare));
    return result;
});

const subjectsHashAndDndSelector = createSelector([
    state => state.app.subjectHash,
    state => state.subjectsModule.draggingId,
    state => state.subjectsModule.currentDropCandidateId
], (subjectHash, draggingId, currentDropCandidateId) => {
    let subjects;
    if (currentDropCandidateId){
        subjectHash = {...subjectHash};
        let dropTarget = subjectHash[currentDropCandidateId],
            draggingSubject = subjectHash[`${draggingId}_dragging`] = {...subjectHash[draggingId], candidateMove: true};

        draggingSubject.path = !dropTarget.path ? `,${dropTarget._id},` : dropTarget.path + `${dropTarget._id},`;
        subjects = stackAndGetTopLevelSubjects(subjectHash);
    } else {
        subjects = subjectsSelector(subjectHash).subjects;
    }

    return {
        subjectHash,
        subjects,
        draggingId,
        currentDropCandidateId
    };
});

const subjectsModuleSelector = createSelector([
    topLevelSubjectsSortedSelector,
    editingSubjectHashSelector,
    subjectsHashAndDndSelector,
    pendingSubjectsSelector,
    state => state.subjectsModule.pendingDeleteHash,
    state => state.subjectsModule.deletingHash,
    state => state.subjectsModule.subjectsSaving,
    state => state.subjectsModule.subjectsSaved,
    state => state.app.colors
], (topLevelSubjects, editingHashPacket, DndPacket, pendingSubjectsLookup, pendingDeleteHash, deletingHash, subjectsSaving, subjectsSaved, colors) => ({
    ...editingHashPacket,
    ...DndPacket,
    topLevelSubjects,
    subjectsSaving,
    pendingDeleteHash,
    deletingHash,
    subjectsSaved,
    pendingSubjectsLookup,
    colors
}));

export const selector = subjectsModuleSelector;