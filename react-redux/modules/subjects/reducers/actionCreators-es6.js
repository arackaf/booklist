import {
    ADD_NEW_SUBJECT,
    BEGIN_SUBJECT_EDIT,
    SET_EDITING_SUBJECT_FIELD,
    CANCEL_SUBJECT_EDIT,
    UPDATE_SUBJECT,
    UPDATE_SUBJECT_RESULTS,

    BEGIN_PENDNIG_DELETE,
    CANCEL_PENDNIG_DELETE,
    DELETING_SUBJECTS,
    DONE_DELETING_SUBJECTS,

    SUBJECTS_SAVING,
    CLEAR_SAVING_STATE,
    SUBJECT_DELETING,
    SUBJECT_DELETED,
    SET_SUBJECT_DRAGGING,
    SUBJECT_DRAGGING_OVER
} from './actionNames';

import {
    SAVE_SUBJECT_RESULTS
} from 'applicationRoot/rootReducerActionNames'

import {unwindSubjects, computeParentId, getAllDescendantsOfSubject} from 'applicationRoot/rootReducer';

import {subjectEditingActions} from 'applicationRoot/rootReducerActionCreators';
const {saveSubject: saveSubjectRoot, deleteSubject: deleteSubjectRoot} = subjectEditingActions;

const toIdHash = objs => objs.reduce((hash, obj) => (hash[obj._id] = true, hash), {});

let tempId = -1;

export const addNewSubject = parentId => ({ type: ADD_NEW_SUBJECT, subject: { _id: tempId--, name: 'Pending new subject', parentId: parentId || null, pending: true } });

export const beginDrag = sourceId => ({ type: SET_SUBJECT_DRAGGING, sourceId });
export const clearSubjectDragging = () => ({ type: SUBJECT_DRAGGING_OVER, sourceId: null, targetId: null });
export const subjectDraggingOver = targetId => (dispatch, getState) => {
    let sourceId = getState().subjectsModule.draggingId;
    dispatch({ type: SUBJECT_DRAGGING_OVER, sourceId, targetId });
};

export const cancelSubjectEdit = _id => ({ type: CANCEL_SUBJECT_EDIT, _id });
export const beginSubjectEdit = _id => (dispatch, getState) =>{
    let subject = {...getState().app.subjectHash[_id]};
    subject.parentId = computeParentId(subject.path);
    dispatch({ type: BEGIN_SUBJECT_EDIT, _id, subject });
};

export const beginSubjectDelete = _id => ({ type: BEGIN_PENDNIG_DELETE, _id });
export const cancelSubjectDelete = _id => ({ type: CANCEL_PENDNIG_DELETE, _id });

export const setEditingSubjectField = (_id, field, value) => ({ type: SET_EDITING_SUBJECT_FIELD, _id, field, value });

export const saveChanges = (subject, original) => (dispatch, getState) => {
    let { _id, name, parentId, backgroundColor, textColor } = subject,
        request = { _id, name, parentId, backgroundColor, textColor };

    if (original.pending){
        request._id = null;
    }

    let oldParentId = original.pending ? '' : computeParentId(getState().app.subjectHash[_id].path);
    let subjectsSavingHash;
    if (oldParentId != subject.parentId){
        subjectsSavingHash = toIdHash(unwindSubjects([original]))
        subjectsSavingHash[subject.parentId] = true;

        if (subject.parentId) {
            let newParentPath = getState().app.subjectHash[subject.parentId].path;
            if (newParentPath) {
                newParentPath.split(',').filter(s => s).forEach(_id => subjectsSavingHash[_id] = true);
            }
        }
    } else {
        subjectsSavingHash = toIdHash([subject]);
    }

    dispatch({ type: SUBJECTS_SAVING, subjects: subjectsSavingHash });

    Promise.resolve(saveSubjectRoot(request, dispatch))
           .then(() => dispatch({ type: CLEAR_SAVING_STATE, subjects: subjectsSavingHash }));
}

export const setNewParent = (subject, newParent) => (dispatch, getState) => {
    let { _id, name, backgroundColor, textColor } = subject,
        adjustedSubject = {...subject},
        request = {_id, name, backgroundColor, textColor, parentId: newParent._id};

    if (!newParent.path){
        adjustedSubject.path = `,${newParent._id},`;
    } else {
        adjustedSubject.path = `${newParent.path},${newParent._id},`;
    }

    let subjectsSavingHash = toIdHash(unwindSubjects([adjustedSubject]));
    adjustedSubject.path.split(',').filter(s => s).forEach(_id => subjectsSavingHash[_id] = true);

    //provide immediate feedback, so the DnD "sticks"
    dispatch({ type: SAVE_SUBJECT_RESULTS, affectedSubjects: [adjustedSubject] });
    dispatch(clearSubjectDragging());
    //disable dragging and editing on the entire hierarchy until the save is done
    dispatch({ type: SUBJECTS_SAVING, subjects: subjectsSavingHash });

    Promise.resolve(saveSubjectRoot(request, dispatch))
           .then(() => dispatch({ type: CLEAR_SAVING_STATE, subjects: subjectsSavingHash }));
};

export const deleteSubject = _id => (dispatch, getState) => {
    let subjectHash = getState().app.subjectHash,
        subjectsDeleting = [{_id}, ...getAllDescendantsOfSubject(_id, subjectHash)];

    dispatch({ type: DELETING_SUBJECTS, subjects: toIdHash(subjectsDeleting) });

    Promise.resolve(deleteSubjectRoot(_id, dispatch))
           .then(resp => dispatch({type: DONE_DELETING_SUBJECTS, subjects: toIdHash(resp.subjectsDeleted) }));
};