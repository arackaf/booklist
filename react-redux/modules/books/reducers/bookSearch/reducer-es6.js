import { BEGIN_FILTER_CHANGE, SET_PENDING_SUBJECT, END_FILTER_CHANGE, SET_FILTERS, SET_PENDING, SET_VIEWING_USERID, SET_SEARCH_SUBJECTS_VALUE } from './actionNames';

import { subjectsSelector } from '../subjects/reducer';
import { booksSelector } from '../books/reducer';

const searchFields = {
    search: '',
    subjects: {},
    searchChildSubjects: false,
    author: '',
    publisher: '',
    pages: '',
    pagesOperator: '>'
}

const initialState = {
    sort: '',
    sortDirection: '',
    editingFilters: false,
    ...searchFields,
    pending: {
        ...searchFields
    },
    searchSubjectsValue: ''
};

export function bookSearchReducer(state = initialState, action){
    switch(action.type){
        case SET_SEARCH_SUBJECTS_VALUE:
            return { ...state, searchSubjectsValue: action.value };
        case SET_FILTERS:
            let newSearchFields = {};
            Object.keys(searchFields).forEach(k => newSearchFields[k] = action[k]);
            return { ...state, ...action.packet, pending: { ...action.packet } };
        case SET_PENDING:
            return { ...state, pending: { ...state.pending, [action.field]: action.value } };
        case BEGIN_FILTER_CHANGE:
            let result = Object.assign({}, state, { editingFilters: true, searchSubjectsValue: '' });
            Object.keys(searchFields).forEach(k => state.pending[k] = state[k]);
            return result;
        case SET_PENDING_SUBJECT:
            return Object.assign({}, state, { pending: { ...state.pending, subjects: { ...state.pending.subjects, [action._id]: action.value } } });
        case END_FILTER_CHANGE:
            return Object.assign({}, state, { editingFilters: false });
    }
    return state;
}

function projectSelectedSubjects(subjectIds, subjects){
    //last filter since subjects might not be loaded yet
    return Object.keys(subjectIds).filter(k => subjectIds[k]).map(_id => subjects[_id]).filter(s => s);
}

export const bookSearchSelector = state => {
    let booksModule = state.booksModule,
        root = state.root;

    let subjectsState = subjectsSelector(state);
    let booksState = booksSelector(state);

    return Object.assign({},
        booksModule.bookSearch,
        {
            selectedSubjects: projectSelectedSubjects(booksModule.bookSearch.subjects, booksModule.subjects.subjectHash),
            pendingSelectedSubjects: projectSelectedSubjects(booksModule.bookSearch.pending.subjects, booksModule.subjects.subjectHash),
            ...booksModule.ui,
            subjects: subjectsState.subjects,
            allSubjectsSorted: subjectsState.allSubjectsSorted,
            selectedBooksCount: booksState.selectedBooksCount,
            viewingPublic: root.isPublic,
            eligibleFilterSubjects: subjectsState.subjectsUnwound
        });
}