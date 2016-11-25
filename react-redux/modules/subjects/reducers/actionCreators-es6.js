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

import {
    SAVE_SUBJECT_RESULTS
} from 'applicationRoot/rootReducerActionNames'

export const subjectDraggingOver = (sourceId, targetId) => ({ type: SUBJECT_DRAGGING_OVER, sourceId, targetId });

export const cancelSubjectEdit = _id => ({ type: CANCEL_SUBJECT_EDIT, _id });

export const beginSubjectEdit = _id => (dispatch, getState) =>{
    let subject = {...getState().app.subjectHash[_id]};
    if (subject.path){
        let pathParts = subject.path.split(',');
        subject.parentId = pathParts[pathParts.length - 2];
    } else {
        subject.parentId = null;
    }
    dispatch({ type: BEGIN_SUBJECT_EDIT, _id, subject });
};

export const setNewParent = (subject, newParent) => (dispatch, getState) => {
    let _id = subject._id,
        adjustedSubject = {...subject};

    if (!newParent.path){
        adjustedSubject.path = `,${newParent._id},`;
    } else {
        adjustedSubject.path = `${newParent.path},${newParent._id},`;
    }

    dispatch({ type: SAVE_SUBJECT_RESULTS, affectedSubjects: [adjustedSubject] })
}