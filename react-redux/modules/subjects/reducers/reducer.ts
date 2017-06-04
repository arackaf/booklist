import {createSelector} from 'reselect';

import {stackAndGetTopLevelSubjects, subjectsSelector, getEligibleParents, topLevelSubjectsSortedSelector} from 'applicationRoot/rootReducer';
import {appType} from 'applicationRoot/rootReducer';
import update from 'immutability-helper'

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
    SET_SUBJECT_DRAGGING,
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

export type subjectType = {
    _id: string;
    name: string;
    parentId: string;
}

export type subjectsType = typeof initialSubjectsState;

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
            return update(state, {
                editingSubjectsHash: {$unset: [action._id]},
                pendingSubjectsHash: {$unset: [action._id]}
            });

        case BEGIN_PENDNIG_DELETE:
            return {...state, pendingDeleteHash: {...state.pendingDeleteHash, [action._id]: true}};
        case CANCEL_PENDNIG_DELETE:
            return update(state, {pendingDeleteHash: {$unset: [action._id]}});
        case DELETING_SUBJECTS:
            return {...state, deletingHash: {...state.deletingHash, ...action.subjects }};
        case DONE_DELETING_SUBJECTS:
            return update(state, {
                pendingDeleteHash: {$unset: Object.keys(action.subjects)},
                deletingHash: {$unset: Object.keys(action.subjects)}
            });
        case SET_SUBJECT_DRAGGING:
            return {...state, draggingId: action.sourceId};
        case SUBJECT_DRAGGING_OVER:
            return { ...state, draggingId: action.sourceId, currentDropCandidateId: action.targetId };
        case SUBJECTS_SAVING:
            return {...state, subjectsSaving: {...state.subjectsSaving, ...action.subjects}};
        case CLEAR_SAVING_STATE:
            return update(state, {
                subjectsSaved: {$unset: Object.keys(action.subjects)},
                subjectsSaving: {$unset: Object.keys(action.subjects)},
                editingSubjectsHash: {$unset: Object.keys(action.subjects)},
                pendingSubjectsHash: {$unset: Object.keys(action.subjects)}
            });
        case SET_EDITING_SUBJECT_FIELD:
            return {
                ...state,
                editingSubjectsHash: {...state.editingSubjectsHash, [action._id]: {...state.editingSubjectsHash[action._id], [action.field]: action.value}}
            };

    }
    return state;
}

type storeSlice = {app: appType, subjectsModule: subjectsType};
export type editingSubjectHashType = {editingSubjectsHash: object};
export const editingSubjectHashSelector = createSelector<storeSlice, editingSubjectHashType, object, object>(
    state => state.app.subjectHash,
    state => state.subjectsModule.editingSubjectsHash, 
    (subjectHash, editingSubjectsHash) => {
        return {
            editingSubjectsHash: Object.keys(editingSubjectsHash)
                                    .map(_id => editingSubjectsHash[_id])
                                    .reduce((hash, s) => (hash[s._id] = {...s, eligibleParents: getEligibleParents(subjectHash, s._id)}, hash), {})
        };
    }
);

export type draggingSubjectType = subjectType & {
    candidateMove: boolean
};
export const draggingSubjectSelector = createSelector<storeSlice, draggingSubjectType, object, string>(
    state => state.app.subjectHash,
    state => state.subjectsModule.draggingId,
    (subjectHash, draggingId) => draggingId ? {...subjectHash[draggingId], _id: draggingId + '_dragging', candidateMove: true} : null);

const tempSubjectCompare = ({_id: id1}, {_id: id2}) => id1 - id2;

export type pendingSubjectsType = {
    [s: string]: subjectType[]
}
export const pendingSubjectsSelector = createSelector<storeSlice, pendingSubjectsType, any>(
    state => state.subjectsModule.pendingSubjectsHash,
    pendingSubjectsHash => {
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
    }
);