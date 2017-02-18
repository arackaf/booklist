import {
    NEW_SUBJECT,
    EDIT_SUBJECT,
    EDIT_SUBJECTS,
    SET_NEW_SUBJECT_VALUE,
    STOP_EDITING_SUBJECTS,
    UPDATE_SUBJECT,
    UPDATE_SUBJECT_RESULTS,
    CANCEL_SUBJECT_EDIT,
    BEGIN_SUBJECT_DELETE,
    CANCEL_SUBJECT_DELETE,
    SUBJECT_DELETING,
    SET_SUBJECT_SEARCH_VALUE
} from './actionNames';

import {subjectEditingActions} from 'applicationRoot/rootReducerActionCreators';
const {saveSubject, deleteSubject: deleteSubjectRoot} = subjectEditingActions;

export const setSubjectSearchValue = value => ({ type: SET_SUBJECT_SEARCH_VALUE, value: value.target.value });
export const editSubjects = () => ({ type: EDIT_SUBJECTS })
export const setNewSubjectName = value => ({ type: SET_NEW_SUBJECT_VALUE, field: 'name', value });
export const setNewSubjectParent = value => ({ type: SET_NEW_SUBJECT_VALUE, field: 'parentId', value });
export const setNewSubjectBackgroundColor = value => ({ type: SET_NEW_SUBJECT_VALUE, field: 'backgroundColor', value });
export const setNewSubjectTextColor = value => ({ type: SET_NEW_SUBJECT_VALUE, field: 'textColor', value })
export const stopEditingSubjects = () => ({ type: STOP_EDITING_SUBJECTS });

const getEditingSubject = (hash, _id) => {
    let subject = hash[_id];
    let parentId = '';
    if (subject.path){
        let hierarchy = subject.path.split(',');
        parentId = hierarchy[hierarchy.length - 2];
    }

    return { ...subject, parentId };
}

export function editSubject(_id) {
    return function (dispatch, getState){
        let editingSubject = getEditingSubject(getState().app.subjectHash, _id);
        dispatch({ type: EDIT_SUBJECT, _id, editingSubject });
    }
}

export const newSubject = () => ({ type: NEW_SUBJECT });
export const cancelSubjectEdit = () => ({ type: CANCEL_SUBJECT_EDIT });

export function createOrUpdateSubject(){
    return function(dispatch, getState) {
        let { _id, name, parentId, backgroundColor, textColor } = getState().booksModule.subjects.editingSubject,
            request = { _id: _id || null, name, parentId, backgroundColor, textColor };

        saveSubject(request, dispatch);
    }
}

export const beginDeleteSubject = _id => ({ type: BEGIN_SUBJECT_DELETE, _id });
export const cancelDeleteSubject = () => ({ type: CANCEL_SUBJECT_DELETE });

export function deleteSubject(_id){
    return function(dispatch, getState) {
        dispatch({type: SUBJECT_DELETING});
        deleteSubjectRoot(_id, dispatch);
    }
}