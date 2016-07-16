import { createSelector } from 'reselect';

import {
    ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK, ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS, CANCEL_BOOKS_SUBJECT_MODIFICATION, SET_BOOKS_SUBJECTS,
    SETTING_BOOKS_SUBJECTS, FINISHED_SUBJECT_MODIFICATION, ADDING_SUBJECT_SEARCH_CHANGE, REMOVING_SUBJECT_SEARCH_CHANGE,
    ADDING_SUBJECT_SET, REMOVING_SUBJECT_SET, RESET_SUBJECTS
} from './actionNames';

import { subjectsSelector } from '../subjects/reducer';

const bookSubjectManagerInitialState = {
    singleBookModify: null,
    selectedBooksModify: false,
    addingSubjects: {},
    removingSubjects: {},
    settingBooksSubjects: false,
    addingSubjectSearch: '',
    removingSubjectSearch: ''
};

export function bookSubjectManagerReducer(state = bookSubjectManagerInitialState, action){
    switch (action.type){
        case SETTING_BOOKS_SUBJECTS:
            return Object.assign({}, state, { settingBooksSubjects: true });
        case SET_BOOKS_SUBJECTS:
            return Object.assign({}, state, { settingBooksSubjects: false });
        case ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK:
            return Object.assign({}, state, { singleBookModify: action._id });
        case ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS:
            return Object.assign({}, state, { selectedBooksModify: true });
        case CANCEL_BOOKS_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { singleBookModify: null, selectedBooksModify: false });
        case FINISHED_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { addingSubjects: {}, removingSubjects: {}, singleBookModify: null, selectedBooksModify: false });
        case ADDING_SUBJECT_SEARCH_CHANGE:
            return Object.assign({}, state, { addingSubjectSearch: action.value });
        case ADDING_SUBJECT_SET:
            return Object.assign({}, state, { addingSubjectSearch: '', addingSubjects: { ...state.addingSubjects, [action._id]: action.value } });
        case REMOVING_SUBJECT_SEARCH_CHANGE:
            return Object.assign({}, state, { removingSubjectSearch: action.value });
        case REMOVING_SUBJECT_SET:
            return Object.assign({}, state, { removingSubjectSearch: '', removingSubjects: { ...state.removingSubjects, [action._id]: action.value } })
        case RESET_SUBJECTS:
            return Object.assign({}, state, { addingSubjects: {}, removingSubjects: {} });
    }
    return state;
}

const modifyingBooksSelector = createSelector(
    [
        ({ booksModule }) => booksModule.booksSubjectsModifier.singleBookModify,
        ({ booksModule }) => booksModule.booksSubjectsModifier.selectedBooksModify,
        ({ booksModule }) => booksModule.books
    ],
    (singleBookModify, selectedBooksModify, books) => {
        let modifyingBookIds = singleBookModify ? [singleBookModify] : (selectedBooksModify ? Object.keys(books.selectedBooks).filter(k => books.selectedBooks[k]) : []);
        return modifyingBookIds.filter(_id => _id).map(_id => books.booksHash[_id]);
    }
);

const unwindSubjects = (subjects, search, currentLevel = 0) => {
    if (typeof search === 'string'){
        if (!search){
            search = () => true;
        } else {
            let regex = new RegExp(search, 'i');
            search = txt => regex.test(txt);
        }
    }
    let result = [];
    subjects.forEach(s => {
        if (search(s.name)) {
            result.push({...s, childLevel: currentLevel});
        }
        result.push(...unwindSubjects(s.children, search, currentLevel + 1));
    });
    return result;
};

const addingSubjectsSelector = createSelector(
    [
        ({ booksModule }) => booksModule.booksSubjectsModifier.addingSubjects,
        ({ booksModule }) => booksModule.booksSubjectsModifier.addingSubjectSearch,
        ({ booksModule }) => booksModule.subjects.subjectHash,
        subjectsSelector
    ],
    (adding, addingSubjectSearch, subjects, subjectsSelected) => ({
        addingSubjects: Object.keys(adding).filter(_id => adding[_id]).map(_id => subjects[_id]),
        eligibleToAdd: unwindSubjects(subjectsSelected.subjects, addingSubjectSearch)
    })
);

const removingSubjectsSelector = createSelector(
    [
        ({ booksModule }) => booksModule.booksSubjectsModifier.removingSubjects,
        ({ booksModule }) => booksModule.booksSubjectsModifier.removingSubjectSearch,
        ({ booksModule }) => booksModule.subjects.subjectHash,
        subjectsSelector
    ],
    (removing, removingSubjectSearch, subjects, subjectsSelected) => ({
        removingSubjects: Object.keys(removing).filter(_id => removing[_id]).map(_id => subjects[_id]),
        eligibleToRemove: unwindSubjects(subjectsSelected.subjects, removingSubjectSearch)
    })
);

export const booksSubjectsModifierSelector = createSelector(
    [
        ({ booksModule }) => booksModule.booksSubjectsModifier,
        modifyingBooksSelector,
        addingSubjectsSelector,
        removingSubjectsSelector,
        subjectsSelector
    ],
    (booksSubjectsModifier, modifyingBooks, { addingSubjects, eligibleToAdd }, { removingSubjects, eligibleToRemove }, subjectsState) => ({
        addingSubjectIds: booksSubjectsModifier.addingSubjects,
        removingSubjectIds: booksSubjectsModifier.removingSubjects,
        settingBooksSubjects: booksSubjectsModifier.settingBooksSubjects,
        modifyingBooks,
        addingSubjects,
        eligibleToAdd,
        removingSubjects,
        eligibleToRemove,
        subjects: subjectsState.subjects,
        allSubjectsSorted: subjectsState.allSubjectsSorted,
        addingSubjectSearch: booksSubjectsModifier.addingSubjectSearch,
        removingSubjectSearch: booksSubjectsModifier.removingSubjectSearch
    })
);