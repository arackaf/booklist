import {
    ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK,
    ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS,
    SETTING_BOOKS_SUBJECTS,
    SET_BOOKS_SUBJECTS,
    CANCEL_BOOKS_SUBJECT_MODIFICATION,
    FINISHED_SUBJECT_MODIFICATION,
    ADDING_SUBJECT_SEARCH_CHANGE,
    REMOVING_SUBJECT_SEARCH_CHANGE,
    ADDING_SUBJECT_SET,
    REMOVING_SUBJECT_SET,
    RESET_SUBJECTS
} from './actionNames';

export function cancelBookSubjectModification(){
    return { type: CANCEL_BOOKS_SUBJECT_MODIFICATION }
}

export function setBooksSubjects(books, add, remove){
    return function(dispatch, getState){
        dispatch({ type: SETTING_BOOKS_SUBJECTS });
        ajaxUtil.post('/bookBulk/setSubjects', { books, add, remove }, resp => {
            dispatch({ type: SET_BOOKS_SUBJECTS, books, add, remove });
            dispatch({ type: FINISHED_SUBJECT_MODIFICATION });
        });
    }
}

export function enableSubjectModificationSingleBook(_id){
    return { type: ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK, _id }
}

export function enableSubjectModificationToggledBooks(){
    return { type: ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS }
}

export function addingSearchValueChange(value){
    return { type: ADDING_SUBJECT_SEARCH_CHANGE, value: value.target.value };
}

export function addingSubjectSet(value, subject){
    return { type: ADDING_SUBJECT_SET, _id: subject._id, value };
}

export function removingSearchValueChange(value){
    return { type: REMOVING_SUBJECT_SEARCH_CHANGE, value: value.target.value || '' };
}

export function removingSubjectSet(value, subject){
    return { type: REMOVING_SUBJECT_SET, _id: subject._id, value };
}

export function resetSubjects(){
    return { type: RESET_SUBJECTS };
}