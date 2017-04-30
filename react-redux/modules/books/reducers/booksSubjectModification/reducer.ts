import { createSelector } from 'reselect';

import {
    ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK, ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS, CANCEL_BOOKS_SUBJECT_MODIFICATION, SET_BOOKS_SUBJECTS,
    SETTING_BOOKS_SUBJECTS, FINISHED_SUBJECT_MODIFICATION, ADDING_SUBJECT_SEARCH_CHANGE, REMOVING_SUBJECT_SEARCH_CHANGE,
    ADDING_SUBJECT_SET, REMOVING_SUBJECT_SET, RESET_SUBJECTS
} from './actionNames';

import { subjectsSelector, filterSubjects } from '../subjects/reducer';
import {appType} from 'applicationRoot/rootReducer';

const bookSubjectManagerInitialState = {
    singleBookModify: null,
    selectedBooksModify: false,
    addingSubjects: {},
    removingSubjects: {},
    settingBooksSubjects: false,
    addingSubjectSearch: '',
    removingSubjectSearch: ''
};
export type bookSubjectManagerType = typeof bookSubjectManagerInitialState;

export function bookSubjectManagerReducer(state = bookSubjectManagerInitialState, action) : bookSubjectManagerType {
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

type storeSlice = {
    app: appType;
    booksModule: {
        booksSubjectsModifier: bookSubjectManagerType;
        books: any;
    }
};

type modifyingBooksType = any[];
export const modifyingBooksSelector = createSelector<storeSlice, modifyingBooksType, any, any, any>(
    ({ booksModule }) => booksModule.booksSubjectsModifier.singleBookModify,
    ({ booksModule }) => booksModule.booksSubjectsModifier.selectedBooksModify,
    ({ booksModule }) => booksModule.books,
    (singleBookModify, selectedBooksModify, books) => {
        let modifyingBookIds = singleBookModify ? [singleBookModify] : (selectedBooksModify ? Object.keys(books.selectedBooks).filter(k => books.selectedBooks[k]) : []);
        return modifyingBookIds.filter(_id => _id).map(_id => books.booksHash[_id]);
    }
);

type addingSubjectsType = {
    addingSubjects: any[];
    eligibleToAdd: any[];
}
const addingSubjectsSelector = createSelector<storeSlice, addingSubjectsType, any, any, any, any>(
    state => state.booksModule.booksSubjectsModifier.addingSubjects,
    state => state.booksModule.booksSubjectsModifier.addingSubjectSearch,
    state => state.app.subjectHash,
    subjectsSelector,
    (adding, addingSubjectSearch, subjects, subjectsSelected) => ({
        addingSubjects: Object.keys(adding).filter(_id => adding[_id]).map(_id => subjects[_id]),
        eligibleToAdd: filterSubjects(subjectsSelected.subjectsUnwound, addingSubjectSearch)
    })
);

type removingSubjectsType = {
    removingSubjects: any[];
    eligibleToRemove: any[];
}
const removingSubjectsSelector = createSelector<storeSlice, removingSubjectsType, any, any, any, any>(
    state => state.booksModule.booksSubjectsModifier.removingSubjects,
    state => state.booksModule.booksSubjectsModifier.removingSubjectSearch,
    state => state.app.subjectHash,
    subjectsSelector,
    (removing, removingSubjectSearch, subjects, subjectsSelected) => ({
        removingSubjects: Object.keys(removing).filter(_id => removing[_id]).map(_id => subjects[_id]),
        eligibleToRemove: filterSubjects(subjectsSelected.subjectsUnwound, removingSubjectSearch)
    })
);

export type booksTagsModifier = addingSubjectsType & removingSubjectsType & {
    addingSubjectIds: string[];
    removingSubjectIds: string[];
    settingBooksSubjects: any;
    modifyingBooks: any;
    subjects: any[];
    allSubjectsSorted: any[];
    addingSubjectSearch: string;
    removingSubjectSearch: string;
}
export const booksSubjectsModifierSelector = createSelector<any, booksTagsModifier, any, any, any, any, any>(
    ({ booksModule }) => booksModule.booksSubjectsModifier,
    modifyingBooksSelector,
    addingSubjectsSelector,
    removingSubjectsSelector,
    subjectsSelector,
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