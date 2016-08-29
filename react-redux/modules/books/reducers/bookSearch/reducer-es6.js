import { BEGIN_FILTER_CHANGE, SET_PENDING_SUBJECT, END_FILTER_CHANGE, SET_FILTERS, SET_PENDING, SET_VIEWING_USERID, SET_SEARCH_SUBJECTS_VALUE, SET_SEARCH_TAGS_VALUE, SET_PENDING_TAG } from './actionNames';

import { LOAD_BOOKS_RESULTS } from '../books/actionNames';

import { subjectsSelector, filterSubjects } from '../subjects/reducer';
import { booksSelector } from '../books/reducer';
import { tagsSelector } from '../tags/reducer';

const searchFields = {
    search: '',
    subjects: {},
    tags: {},
    searchChildSubjects: false,
    author: '',
    publisher: '',
    pages: '',
    pagesOperator: '>',
    page: 1,
    pageSize: 50
}

const initialState = {
    sort: '',
    sortDirection: '',
    editingFilters: false,
    hasMore: false,
    ...searchFields,
    pending: {
        ...searchFields
    },
    searchSubjectsValue: '',
    searchTagsValue: ''
};

export function bookSearchReducer(state = initialState, action){
    switch(action.type){
        case SET_SEARCH_SUBJECTS_VALUE:
            return { ...state, searchSubjectsValue: action.value };
        case SET_SEARCH_TAGS_VALUE:
            return { ...state, searchTagsValue: action.value };
        case SET_FILTERS:
            return { ...state, ...searchFields, ...action.packet, pending: { ...state.pending, ...searchFields, ...action.packet } };
        case SET_PENDING:
            return { ...state, pending: { ...state.pending, [action.field]: action.value } };
        case BEGIN_FILTER_CHANGE:
            let result = Object.assign({}, state, { editingFilters: true, searchSubjectsValue: '', searchTagsValue: '' });
            Object.keys(searchFields).forEach(k => state.pending[k] = state[k]);
            return result;
        case SET_PENDING_SUBJECT:
            return Object.assign({}, state, { pending: { ...state.pending, subjects: { ...state.pending.subjects, [action._id]: action.value } } });
        case SET_PENDING_TAG:
            return Object.assign({}, state, { pending: { ...state.pending, tags: { ...state.pending.tags, [action._id]: action.value } } });
        case END_FILTER_CHANGE:
            return Object.assign({}, state, { editingFilters: false });
        case LOAD_BOOKS_RESULTS:
            return Object.assign({}, state, { hasMore: action.hasMore });
    }
    return state;
}

function projectSelectedItems(ids, hash){
    return Object.keys(ids).filter(k => ids[k]).map(_id => hash[_id]).filter(s => s);
}

export const bookSearchSelector = state => {
    let booksModule = state.booksModule,
        bookSearch = state.booksModule.bookSearch,
        app = state.app;

    let subjectsState = subjectsSelector(state);
    let booksState = booksSelector(state);
    let tagsState = tagsSelector(state);
    let bindableSortValue = !bookSearch.sort ? '_id|desc' : `${bookSearch.sort}|${bookSearch.sortDirection == 1 ? 'asc' : 'desc'}`;
    let ui = booksModule.ui;

    return Object.assign({},
        booksModule.bookSearch,
        {
            selectedSubjects: projectSelectedItems(bookSearch.subjects, booksModule.subjects.subjectHash),
            selectedTags: projectSelectedItems(bookSearch.tags, booksModule.tags.tagHash),
            pendingSelectedSubjects: projectSelectedItems(booksModule.bookSearch.pending.subjects, booksModule.subjects.subjectHash),
            pendingSelectedTags: projectSelectedItems(booksModule.bookSearch.pending.tags, booksModule.tags.tagHash),
            ...booksModule.ui,
            subjects: subjectsState.subjects,
            allSubjectsSorted: subjectsState.allSubjectsSorted,
            selectedBooksCount: booksState.selectedBooksCount,
            viewingPublic: app.isPublic,
            eligibleFilterSubjects: filterSubjects(subjectsState.subjectsUnwound, bookSearch.searchSubjectsValue),
            eligibleFilterTags: filterSubjects(tagsState.allTagsSorted, bookSearch.searchTagsValue),
            bindableSortValue,
            showingDesktop: ui.desktopRequested || (ui.isDesktop && !ui.mobileRequested),
            showingMobile: !(ui.desktopRequested || (ui.isDesktop && !ui.mobileRequested)),
            metaTagNeeded: ui.isMobile && !ui.desktopRequested
        });
}