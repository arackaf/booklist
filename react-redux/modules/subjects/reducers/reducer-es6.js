import {createSelector} from 'reselect';

import {stackAndGetTopLevelSubjects, subjectsSelector} from 'applicationRoot/rootReducer';

import {
    BEGIN_SUBJECT_EDIT,
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
    editingSubjectsHash: {}
};

export function reducer(state = initialSubjectsState, action){
    switch(action.type){
        case BEGIN_SUBJECT_EDIT:
            return {...state, editingSubjectsHash: {...state.editingSubjectsHash, [action._id]: action.subject}}
        case CANCEL_SUBJECT_EDIT:
        case SUBJECT_DRAGGING_OVER:
            return { ...state, draggingId: action.sourceId, currentDropCandidateId: action.targetId }
    }
    return state;
}

const subjectsModuleSelector = createSelector([
    state => state.app.subjectHash,
    state => state.subjectsModule.editingSubjectsHash,
    state => state.subjectsModule.draggingId,
    state => state.subjectsModule.currentDropCandidateId
], (subjectHash, editingSubjectsHash, draggingId, currentDropCandidateId) => {
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
        editingSubjectsHash,
        subjects,
        draggingId,
        currentDropCandidateId
    };
});

export const selector = subjectsModuleSelector;