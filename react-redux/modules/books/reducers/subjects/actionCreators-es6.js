import {
    LOAD_SUBJECTS, LOAD_SUBJECTS_RESULTS, NEW_SUBJECT, EDIT_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_VALUE,
    STOP_EDITING_SUBJECTS, UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS, SUBJECT_DELETED, LOAD_COLORS, CANCEL_SUBJECT_EDIT
} from './actionNames';

let subjectsLoadedOrLoading = false;
export function loadSubjects(){
    return function(dispatch, getState){
        if (subjectsLoadedOrLoading) return;
        subjectsLoadedOrLoading = true;

        dispatch({ type: LOAD_SUBJECTS });

        Promise.resolve(ajaxUtil.get('/subject/all')).then(subjectsResp => {
            dispatch({type: LOAD_SUBJECTS_RESULTS, subjects: subjectsResp.results});
            dispatch({type: LOAD_COLORS, colors: subjectsResp.colors });
        });
    }
}

export function editSubjects(){
    return { type: EDIT_SUBJECTS };
}

export function setNewSubjectName(value){
    return { type: SET_NEW_SUBJECT_VALUE, field: 'name', value };
}

export function setNewSubjectParent(value){
    return { type: SET_NEW_SUBJECT_VALUE, field: 'parentId', value };
}

export function setNewSubjectBackgroundColor(value){
    return { type: SET_NEW_SUBJECT_VALUE, field: 'backgroundColor', value };
}

export function setNewSubjectTextColor(value){
    return { type: SET_NEW_SUBJECT_VALUE, field: 'textColor', value };
}

export function stopEditingSubjects(){
    return { type: STOP_EDITING_SUBJECTS };
}

export function editSubject(_id){
    return { type: EDIT_SUBJECT, _id };
}

export function newSubject(){
    return { type: NEW_SUBJECT };
}

export function cancelSubjectEdit(){
    return { type: CANCEL_SUBJECT_EDIT };
}

export function createOrUpdateSubject(){
    return function(dispatch, getState) {
        let { editingSubject, name, parentId, backgroundColor, textColor } = getState().books.subjects.editSubjectsPacket,
            request = { _id: editingSubject ? editingSubject._id : null, name, parentId, backgroundColor, textColor };

        ajaxUtil.post('/subject/setInfo', request, resp => dispatch({ type: UPDATE_SUBJECT_RESULTS, affectedSubjects: resp.affectedSubjects }));
    }
}

export function deleteSubject(){
    return function(dispatch, getState) {
        let request = { _id: getState().books.subjects.editSubjectsPacket.editingSubject._id + '' };
        ajaxUtil.post('/subject/delete', request, resp => {
            dispatch({ type: SUBJECT_DELETED, subjectsDeleted: resp.subjectsDeleted });
        });
    }
}