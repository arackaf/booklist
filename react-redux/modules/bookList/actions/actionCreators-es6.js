import { LOAD_BOOKS, LOAD_BOOKS_RESULTS, LOAD_SUBJECTS, LOAD_SUBJECTS_RESULTS,
        TOGGLE_SELECT_BOOK, SELECT_ALL_BOOKS, DE_SELECT_ALL_BOOKS,
        EDIT_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_NAME, SET_NEW_SUBJECT_PARENT, STOP_EDITING_SUBJECTS,
        UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS
} from './actionNames';

export {
    enableSubjectModificationSingleBook,
    enableSubjectModificationToggledBooks
} from './bookSubjectModify/actionCreators';

export {
    setFilteredSubjects,
    setSearchFilterText
} from './bookSearch/actionCreators';

export function loadBooksAndSubjects(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_SUBJECTS });
        dispatch({ type: LOAD_BOOKS });

        Promise.all([
            ajaxUtil.get('/subject/all'),
            booksSearch(getState().bookList.bookSearch)
        ]).then(([subjectsResp, booksResp]) => {
            dispatch({ type: LOAD_SUBJECTS_RESULTS, subjects: subjectsResp.results });
            dispatch(booksResults(booksResp)); //have the subjects in place before loading books
        });
    }
}

export function loadBooks(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_BOOKS });

        Promise.resolve(booksSearch(getState().bookList.bookSearch)).then(resp => dispatch(booksResults(resp)));
    }
}

export function booksSearch(bookSearchState){
    return ajaxUtil.get('/book/searchBooks', {
        search: bookSearchState.searchText,
        subjects: Object.keys(bookSearchState.subjects),
        searchChildSubjects: bookSearchState.searchChildSubjects
    });
}

export function booksResults(resp){
    return { type: LOAD_BOOKS_RESULTS, books: resp.results };
}

export function editSubjectsForBook(index){
    return { type: EDIT_SUBJECTS_FOR, index };
}

export function addSubjectToBook(subject){
    return function(dispatch, getState) {
        dispatch({ type: MODIFY_SUBJECTS });

        setTimeout(() => dispatch({ type: MODIFY_SUBJECTS_RESULTS, subject: subject }), 1000);
    }
}

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

export function updateSubject(){
    return function(dispatch, getState) {
        let { editingSubject: { _id }, newSubjectName: newName, newSubjectParent: newParent } = getState().bookList.subjects.editSubjectsPacket;

        ajaxUtil.post('/subject/setInfo', {_id, newName, newParent}, resp => {
            dispatch({ type: UPDATE_SUBJECT_RESULTS, _id, newName, newParent, affectedSubjects: resp.affectedSubjects, existingParent: resp.existingParent });
        });
    }
}

export function toggleSelectBook(_id, selected){
    return { type: TOGGLE_SELECT_BOOK, _id, selected }
}