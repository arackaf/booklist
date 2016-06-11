import { SELECT_ALL_BOOKS, DE_SELECT_ALL_BOOKS,
        NEW_SUBJECT, EDIT_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_NAME, SET_NEW_SUBJECT_PARENT, STOP_EDITING_SUBJECTS,
        UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS, SUBJECT_DELETED
} from './actionNames';

export {
    enableSubjectModificationSingleBook,
    enableSubjectModificationToggledBooks
} from './booksSubjectModification/actionCreators';

export * from './editBook/actionCreators';


export function editSubjects(){
    return { type: EDIT_SUBJECTS };
}

export function setNewSubjectName(newName){
    return { type: SET_NEW_SUBJECT_NAME, value: newName };
}

export function setNewSubjectParent(newParent){
    return { type: SET_NEW_SUBJECT_PARENT, value: newParent };
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

export function createOrUpdateSubject(){
    return function(dispatch, getState) {
        let { editingSubject, newSubjectName: newName, newSubjectParent: newParent } = getState().books.subjects.editSubjectsPacket,
            request = { _id: editingSubject ? editingSubject._id : null, newName, newParent };

        ajaxUtil.post('/subject/setInfo', request, resp => {
            dispatch({ type: UPDATE_SUBJECT_RESULTS, newName, newParent, affectedSubjects: resp.affectedSubjects });
        });
    }
}

export function deleteSubject(){
    return function(dispatch, getState) {
        let request = { _id: getState().books.subjects.editSubjectsPacket.editingSubject._id + '' };
        ajaxUtil.post('/subject/delete', request, resp => {
            dispatch({ type: SUBJECT_DELETED, subjectId: request._id, booksUpdated: resp.booksUpdated });
        });
    }
}