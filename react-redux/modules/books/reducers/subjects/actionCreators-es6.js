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
    SUBJECT_DELETED,
    SET_SUBJECT_SEARCH_VALUE
} from './actionNames';

export function loadSubjects(){
    return function(dispatch, getState){
        let publicUserId = getState().app.publicUserId;

        dispatch({ type: LOAD_SUBJECTS });

        Promise.resolve(ajaxUtil.get('/subject/all', { userId: publicUserId })).then(subjectsResp => {
            dispatch({type: LOAD_SUBJECTS_RESULTS, subjects: subjectsResp.results});
            dispatch({type: LOAD_COLORS, colors: subjectsResp.colors });
        });
    }
}

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

        dispatch({ type: UPDATE_SUBJECT });
        ajaxUtil.post('/subject/setInfo', request, resp => dispatch({ type: UPDATE_SUBJECT_RESULTS, affectedSubjects: resp.affectedSubjects }));
    }
}

export const beginDeleteSubject = _id => ({ type: BEGIN_SUBJECT_DELETE, _id });
export const cancelDeleteSubject = () => ({ type: CANCEL_SUBJECT_DELETE });

export function deleteSubject(_id){
    return function(dispatch, getState) {
        let request = { _id: _id + '' };
        dispatch({ type: SUBJECT_DELETING });
        ajaxUtil.post('/subject/delete', request, resp => {
            dispatch({ type: SUBJECT_DELETED, subjectsDeleted: resp.subjectsDeleted, _id });
        });
    }
}