import {
    ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK,
    ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS,
    SETTING_BOOKS_SUBJECTS,
    SET_BOOKS_SUBJECTS,
    CANCEL_BOOKS_SUBJECT_MODIFICATION,
    FINISHED_SUBJECT_MODIFICATION,
    ADDING_SUBJECT_SEARCH_CHANGE,
    SUBJECT_SELECTED_TO_ADD,
    REMOVING_SUBJECT_SEARCH_CHANGE,
    SUBJECT_SELECTED_TO_REMOVE
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
    return { type: ADDING_SUBJECT_SEARCH_CHANGE, value };
}

export function subjectSelectedToAdd(subject){
    return { type: SUBJECT_SELECTED_TO_ADD, _id: subject._id };
}

export function removingSearchValueChange(value){
    return { type: REMOVING_SUBJECT_SEARCH_CHANGE, value };
}

export function subjectSelectedToRemove(subject){
    return { type: SUBJECT_SELECTED_TO_REMOVE, _id: subject._id };
}