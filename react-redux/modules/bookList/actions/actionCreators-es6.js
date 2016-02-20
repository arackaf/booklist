const { LOAD_BOOKS, LOAD_BOOKS_RESULTS, LOAD_SUBJECTS, LOAD_SUBJECTS_RESULTS,
        TOGGLE_SELECT_BOOK, SELECT_ALL_BOOKS, DE_SELECT_ALL_BOOKS,
        EDIT_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_NAME, SET_NEW_SUBJECT_PARENT, STOP_EDITING_SUBJECTS,
        UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS, SET_BOOKS_SUBJECTS,
        SET_FILTERED_SUBJECTS,
        ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK, TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION, TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION,
        ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS, CLEAR_SUBJECT_MODIFICATION_SUBJECTS, CANCEL_SUBJECT_MODIFICATION, SET_TEXT_SEARCH,
        SETTING_BOOKS_SUBJECTS
} = require('./actionNames');

function loadBooksAndSubjects(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_SUBJECTS });
        dispatch({ type: LOAD_BOOKS });

        Promise.all([
            ajaxUtil.get('/subject/all'),
            booksSearch()
        ]).then(([subjectsResp, booksResp]) => {
            dispatch({ type: LOAD_SUBJECTS_RESULTS, subjects: subjectsResp.results });
            dispatch(booksResults(booksResp)); //have the subjects in place before loading books
        });
    }
}

function loadBooks(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_BOOKS });

        Promise.resolve(booksSearch()).then(resp => dispatch(booksResults(resp)));
    }
}

function booksSearch(){
    return ajaxUtil.get('/book/searchBooks', { });
}

function booksResults(resp){
    return { type: LOAD_BOOKS_RESULTS, books: resp.results };
}

function editSubjectsForBook(index){
    return { type: EDIT_SUBJECTS_FOR, index };
}

function addSubjectToBook(subject){
    return function(dispatch, getState) {
        dispatch({ type: MODIFY_SUBJECTS });

        setTimeout(() => dispatch({ type: MODIFY_SUBJECTS_RESULTS, subject: subject }), 1000);
    }
}

function editSubjects(){
    return { type: EDIT_SUBJECTS };
}

function setNewSubjectName(newName){
    return { type: SET_NEW_SUBJECT_NAME, value: newName };

}

function setNewSubjectParent(newParent){
    return { type: SET_NEW_SUBJECT_PARENT, value: newParent };
}

function stopEditingSubjects(){
    return { type: STOP_EDITING_SUBJECTS };
}

function editSubject(_id){
    return { type: EDIT_SUBJECT, _id };
}

function updateSubject(){
    return function(dispatch, getState) {
        let { editingSubject: { _id }, newSubjectName: newName, newSubjectParent: newParent } = getState().bookList.subjects.editSubjectsPacket;

        ajaxUtil.post('/subject/setInfo', {_id, newName, newParent}, resp => {
            dispatch({ type: UPDATE_SUBJECT_RESULTS, _id, newName, newParent, affectedSubjects: resp.affectedSubjects, existingParent: resp.existingParent });
        });
    }
}

function setFilteredSubjects(subjects, searchChildSubjects){
    return { type: SET_FILTERED_SUBJECTS, subjects, searchChildSubjects }
}

function enableSubjectModificationSingleBook(_id){
    return { type: ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK, _id }
}

function enableSubjectModificationToggledBooks(){
    return { type: ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS }
}

function subjectModificationClearSubjects(){
    return { type: CLEAR_SUBJECT_MODIFICATION_SUBJECTS };
}

function toggleSubjectModificationAdd(_id){
    return { type: TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION, _id }
}

function toggleSubjectModificationRemove(_id){
    return { type: TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION, _id }
}

function toggleSelectBook(_id, selected){
    return { type: TOGGLE_SELECT_BOOK, _id, selected }
}

function cancelBookSubjectModification(){
    return { type: CANCEL_SUBJECT_MODIFICATION }
}

function setSearchFilterText(value){
    return { type: SET_TEXT_SEARCH, value }
}

function setBooksSubjects(books, add, remove){
    return function(dispatch, getState){
        dispatch({ type: SETTING_BOOKS_SUBJECTS });
        ajaxUtil.post('/bookBulk/setSubjects', { books, add, remove }, resp => {
            dispatch({ type: SET_BOOKS_SUBJECTS, books, add, remove });
            dispatch(cancelBookSubjectModification())
        });
    }
}

module.exports = {
    loadBooks,
    toggleSelectBook,
    editSubjectsForBook,
    addSubjectToBook,
    loadBooksAndSubjects,
    editSubjects,
    setNewSubjectName,
    setNewSubjectParent,
    stopEditingSubjects,
    editSubject,
    updateSubject,
    setFilteredSubjects,
    setSearchFilterText,
    enableSubjectModificationSingleBook,
    enableSubjectModificationToggledBooks,
    cancelBookSubjectModification,
    toggleSubjectModificationAdd,
    toggleSubjectModificationRemove,
    setBooksSubjects,
    subjectModificationClearSubjects
};

