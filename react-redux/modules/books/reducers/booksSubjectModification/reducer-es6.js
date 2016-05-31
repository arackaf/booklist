const { createSelector } = require('react-redux-util/reselect');

import {
    ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK, ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS, CANCEL_BOOKS_SUBJECT_MODIFICATION, SET_BOOKS_SUBJECTS,
    SETTING_BOOKS_SUBJECTS, TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION, TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION, CLEAR_SUBJECT_MODIFICATION_SUBJECTS,
    FINISHED_SUBJECT_MODIFICATION
} from './actionNames';

const bookSubjectManagerInitialState = {
    singleBookModify: null,
    selectedBooksModify: false,
    addingSubjects: {},
    removingSubjects: {},
    settingBooksSubjects: false
};

function bookSubjectManagerReducer(state = bookSubjectManagerInitialState, action){
    switch (action.type){
        case SETTING_BOOKS_SUBJECTS:
            return Object.assign({}, state, { settingBooksSubjects: true });
        case SET_BOOKS_SUBJECTS:
            return Object.assign({}, state, { settingBooksSubjects: false });
        case ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK:
            return Object.assign({}, state, { singleBookModify: action._id });
        case ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS:
            return Object.assign({}, state, { selectedBooksModify: true });
        case CLEAR_SUBJECT_MODIFICATION_SUBJECTS:
            return Object.assign({}, state, { addingSubjects: {}, removingSubjects: {} });
        case CANCEL_BOOKS_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { singleBookModify: null, selectedBooksModify: false });
        case TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { addingSubjects: { ...state.addingSubjects, [action._id]: !state.addingSubjects[action._id] } });
        case FINISHED_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { addingSubjects: {}, removingSubjects: {}, singleBookModify: null, selectedBooksModify: false });
        case TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { removingSubjects: { ...state.removingSubjects, [action._id]: !state.removingSubjects[action._id] } });
    }
    return state;
}

const modifyingBooksSelector = createSelector(
    [state => state.booksSubjectsModifier.singleBookModify, state => state.booksSubjectsModifier.selectedBooksModify, state => state.books],
    (singleBookModify, selectedBooksModify, books) => {
        let modifyingBookIds = singleBookModify ? [singleBookModify] : (selectedBooksModify ? Object.keys(books.selectedBooks).filter(k => books.selectedBooks[k]) : []);
        return modifyingBookIds.filter(_id => _id).map(_id => books.booksHash[_id]);
    }
);

const addingSubjectsSelector = createSelector(
    [state => state.booksSubjectsModifier.addingSubjects, state => state.subjects.subjectHash],
    (adding, subjects) => Object.keys(adding).filter(_id => adding[_id]).map(_id => subjects[_id])
);

const removingSubjectsSelector = createSelector(
    [state => state.booksSubjectsModifier.removingSubjects, state => state.subjects.subjectHash],
    (removing, subjects) => Object.keys(removing).filter(_id => removing[_id]).map(_id => subjects[_id])
);

const booksSubjectsModifierSelector = createSelector(
    [state => state.booksSubjectsModifier, modifyingBooksSelector, addingSubjectsSelector, removingSubjectsSelector],
    (booksSubjectsModifier, modifyingBooks, addingSubjects, removingSubjects) => ({
        addingSubjectIds: booksSubjectsModifier.addingSubjects,
        removingSubjectIds: booksSubjectsModifier.removingSubjects,
        settingBooksSubjects: booksSubjectsModifier.settingBooksSubjects,
        modifyingBooks,
        addingSubjects,
        removingSubjects
    })
);

module.exports = { bookSubjectManagerReducer, booksSubjectsModifierSelector };