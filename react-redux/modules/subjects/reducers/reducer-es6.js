import {createSelector} from 'reselect';

import {stackAndGetTopLevelSubjects, subjectsSelector, getEligibleParents} from 'applicationRoot/rootReducer';
import {removeKeysFromObject} from 'util/immutableHelpers';

import {
    ADD_NEW_SUBJECT,
    BEGIN_SUBJECT_EDIT,
    SET_EDITING_SUBJECT_FIELD,
    SUBJECTS_SAVING,
    CLEAR_SAVING_STATE,
    CANCEL_SUBJECT_EDIT,
    UPDATE_SUBJECT,
    UPDATE_SUBJECT_RESULTS,
    BEGIN_SUBJECT_DELETE,
    CANCEL_SUBJECT_DELETE,

    SUBJECT_DELETING,
    SUBJECT_DELETED,
    SUBJECT_DRAGGING_OVER
} from './actionNames';

const initialSubjectsState = {
    draggingId: null,
    currentDropCandidateId: null,
    pendingSubjectsHash: {},
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
            return {...state, editingSubjectsHash: removeKeysFromObject(state.editingSubjectsHash, [action._id])};
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

const editingSubjectHashSelector = createSelector([
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

const pendingSubjectsSelector = createSelector([
    state => state.subjectsModule.pendingSubjectsHash
], pendingSubjectsHash => {
    let result = {};
    Object.keys(pendingSubjectsHash).forEach(_id => {
        let subject = pendingSubjectsHash[_id],
            resultKey = subject.parentId || -1;

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
        subjects,
        draggingId,
        currentDropCandidateId
    };
});

const subjectsModuleSelector = createSelector([
    editingSubjectHashSelector,
    subjectsHashAndDndSelector,
    pendingSubjectsSelector,
    state => state.subjectsModule.subjectsSaving,
    state => state.subjectsModule.subjectsSaved,
    state => state.app.colors
], (editingHashPacket, DndPacket, pendingSubjectsLookup, subjectsSaving, subjectsSaved, colors) => ({
    ...editingHashPacket,
    ...DndPacket,
    subjectsSaving,
    subjectsSaved,
    pendingSubjectsLookup,
    colors
}));

export const selector = subjectsModuleSelector;