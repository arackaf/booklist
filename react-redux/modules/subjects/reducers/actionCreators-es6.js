import {
    BEGIN_SUBJECT_EDIT,
    SET_EDITING_SUBJECT_FIELD,
    CANCEL_SUBJECT_EDIT,
    UPDATE_SUBJECT,
    UPDATE_SUBJECT_RESULTS,
    BEGIN_SUBJECT_DELETE,
    CANCEL_SUBJECT_DELETE,

    SUBJECTS_SAVING,
    SUBJECTS_DONE_SAVING,
    CLEAR_MOVING_STATE,
    SUBJECT_DELETING,
    SUBJECT_DELETED,
    SUBJECT_DRAGGING_OVER
} from './actionNames';

import {
    SAVE_SUBJECT_RESULTS
} from 'applicationRoot/rootReducerActionNames'

import {unwindSubjects, subjectsToHash, computeParentId} from 'applicationRoot/rootReducer';

import {subjectEditingActions} from 'applicationRoot/rootReducerActionCreators';
const {saveSubject: saveSubjectRoot, deleteSubject: deleteSubjectRoot} = subjectEditingActions;

export const subjectDraggingOver = (sourceId, targetId) => ({ type: SUBJECT_DRAGGING_OVER, sourceId, targetId });

export const cancelSubjectEdit = _id => ({ type: CANCEL_SUBJECT_EDIT, _id });

export const beginSubjectEdit = _id => (dispatch, getState) =>{
    let subject = {...getState().app.subjectHash[_id]};
    subject.parentId = computeParentId(subject.path);
    dispatch({ type: BEGIN_SUBJECT_EDIT, _id, subject });
};

export const setEditingSubjectField = (_id, field, value) => ({ type: SET_EDITING_SUBJECT_FIELD, _id, field, value });

export function saveChanges(subject, original){
    return function(dispatch, getState) {
        debugger;
        let { _id, name, parentId, backgroundColor, textColor } = subject,
            request = { _id, name, parentId, backgroundColor, textColor };

        let oldParentId = computeParentId(getState().app.subjectHash[_id].path);
        let subjectsSaving = oldParentId != subject.parentId ? subjectsToHash(unwindSubjects([original])) : subjectsToHash([subject]);

        dispatch({ type: SUBJECTS_SAVING, subjects: subjectsSaving });
        setTimeout(() => saveSubjectRoot(request, dispatch), 1500);
    }
}

export const setNewParent = (subject, newParent) => (dispatch, getState) => {
    let _id = subject._id,
        adjustedSubject = {...subject};

    if (!newParent.path){
        adjustedSubject.path = `,${newParent._id},`;
    } else {
        adjustedSubject.path = `${newParent.path},${newParent._id},`;
    }

    let adjustedSubjectsHash = subjectsToHash(unwindSubjects([adjustedSubject]));

    dispatch({ type: SAVE_SUBJECT_RESULTS, affectedSubjects: [adjustedSubject] });
    dispatch({ type: SUBJECTS_SAVING, subjects: adjustedSubjectsHash });

    setTimeout(() => {
        dispatch({ type: SUBJECTS_DONE_SAVING, subjects: adjustedSubjectsHash })

        setTimeout(() => dispatch({ type: CLEAR_MOVING_STATE, subjects: adjustedSubjectsHash }), 1000);
    }, 1500);
}