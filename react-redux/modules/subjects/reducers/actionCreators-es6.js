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

export const subjectDraggingOver = (sourceId, targetId) => ({ type: SUBJECT_DRAGGING_OVER, sourceId, targetId });

export const beginSubjectEdit = _id => (dispatch, getState) =>{
    let subject = getState().app.subjectHash[_id];
    dispatch({ type: BEGIN_SUBJECT_EDIT, _id, subject });
};
