const { LOAD_BOOKS, LOAD_BOOKS_RESULTS, EDIT_SUBJECTS_FOR, MODIFY_SUBJECTS, MODIFY_SUBJECTS_RESULTS, LOAD_SUBJECTS, LOAD_SUBJECTS_RESULTS } = require('./actionNames');

function loadBooks(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_BOOKS });

        ajaxUtil.get('/subject/all', { }, resp => {
            dispatch({ type: LOAD_SUBJECTS_RESULTS, subjects: resp.results });
        });
    }
}

function loadSubjects(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_SUBJECTS });

        ajaxUtil.get('/book/searchBooks', { }, resp => {
            dispatch({ type: LOAD_BOOKS_RESULTS, bookList: resp.results });
        });
    }
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

module.exports = {
    loadBooks,
    editSubjectsForBook,
    addSubjectToBook,
    loadSubjects
};

