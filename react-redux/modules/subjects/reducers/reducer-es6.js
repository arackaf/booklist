import {createSelector} from 'reselect';

import {stackAndGetTopLevelSubjects, subjectsSelector, getEligibleParents} from 'applicationRoot/rootReducer';
import {removeKeysFromObject} from 'util/immutableHelpers';

import {
    BEGIN_SUBJECT_EDIT,
    SET_EDITING_SUBJECT_FIELD,
    SUBJECTS_SAVING,
    SUBJECTS_DONE_SAVING,
    CLEAR_MOVING_STATE,
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
    editingSubjectsHash: {},
    subjectsSaving: {},
    subjectsSaved: {}
};

export function reducer(state = initialSubjectsState, action){
    switch(action.type){
        case BEGIN_SUBJECT_EDIT:
            return {...state, editingSubjectsHash: {...state.editingSubjectsHash, [action._id]: action.subject}}
        case CANCEL_SUBJECT_EDIT:
            return {...state, editingSubjectsHash: removeKeysFromObject(state.editingSubjectsHash, [action._id])};
        case SUBJECT_DRAGGING_OVER:
            return { ...state, draggingId: action.sourceId, currentDropCandidateId: action.targetId };
        case SUBJECTS_SAVING:
            return {...state, subjectsSaving: {...state.subjectsSaving, ...action.subjects}};
        case SUBJECTS_DONE_SAVING:
            return {
                ...state,
                subjectsSaving: removeKeysFromObject(state.subjectsSaving, Object.keys(action.subjects)),
                subjectsSaved: {...state.subjectsSaved, ...action.subjects}
            };
        case CLEAR_MOVING_STATE:
            return {
                ...state,
                subjectsSaved: removeKeysFromObject(state.subjectsSaved, Object.keys(action.subjects)),
                subjectsSaving: removeKeysFromObject(state.subjectsSaving, Object.keys(action.subjects))
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
    state => state.subjectsModule.subjectsSaving,
    state => state.subjectsModule.subjectsSaved,
    state => state.app.colors
], (editingHashPacket, DndPacket, subjectsSaving, subjectsSaved, colors) => ({
    ...editingHashPacket,
    ...DndPacket,
    subjectsSaving,
    subjectsSaved,
    colors
}));

export const selector = subjectsModuleSelector;