import {booksModuleType, appType, booksType, bookSearchType, booksSubjectMofificationType, booksTagModificationType, editBookType, subjectsType, tagsType} from 'modules/books/reducers/reducer';

import {
    BEGIN_FILTER_CHANGE,
    SET_PENDING_SUBJECT,
    END_FILTER_CHANGE,
    SET_FILTERS,
    SET_PENDING,
    SET_VIEWING_USERID,
    SET_SEARCH_SUBJECTS_VALUE,
    SET_SEARCH_TAGS_VALUE,
    SET_PENDING_TAG,
    SET_GRID_VIEW,
    SET_BASIC_LIST_VIEW,
    GRID_VIEW,
    BASIC_LIST_VIEW
} from './actionNames';

import { LOAD_BOOKS_RESULTS } from '../books/actionNames';
import {createSelector} from 'reselect';

import { subjectsSelector, subjectsSelectorType, filterSubjects } from '../subjects/reducer';
import { tagsSelector, tagsSelectorType } from '../tags/reducer';

const searchFields = {
    search: '',
    subjects: {},
    tags: {},
    searchChildSubjects: false,
    author: '',
    publisher: '',
    pages: '',
    pagesOperator: 'lt',
    page: 1,
    pageSize: 50,
    isRead: ''
}
export type searchFieldsType = typeof searchFields;

const initialState = {
    sort: '_id',
    sortDirection: '-1',
    editingFilters: false,
    hasMore: false,
    ...searchFields,
    pending: {
        ...searchFields
    },
    searchSubjectsValue: '',
    searchTagsValue: '',
    view: ''
};
export type bookSearchType = typeof initialState;

export function bookSearchReducer(state = initialState, action) : bookSearchType {
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
        case SET_BASIC_LIST_VIEW:
            return { ...state, view: BASIC_LIST_VIEW };
        case SET_GRID_VIEW:
            return { ...state, view: GRID_VIEW };
    }
    return state;
}

function projectSelectedItems(ids, hash){
    return Object.keys(ids).filter(k => ids[k]).map(_id => hash[_id]).filter(s => s);
}

export type bookSearchUiViewType = {
    isGridView: boolean;
    isBasicList: boolean;
}
export const bookSearchUiViewSelector = createSelector<booksModuleType, bookSearchUiViewType, appType, bookSearchType>(
    state => state.app,
    state => state.booksModule.bookSearch,
    (app, bookSearch) => {
        let view = bookSearch.view,
            isGridView = view == GRID_VIEW || (!view && app.showingDesktop),
            isBasicList = view == BASIC_LIST_VIEW || (!view && app.showingMobile);

        return {
            isGridView,
            isBasicList
        };
    }
);

export type bookSearchSelectorType = bookSearchType & bookSearchUiViewType & {
    selectedSubjects: any[];
    selectedTags: any[];
    pendingSelectedSubjects: any;
    pendingSelectedTags: any;
    eligibleFilterSubjects: any;
    eligibleFilterTags: any;
    bindableSortValue: any;
};
export const bookSearchSelector = createSelector<booksModuleType, bookSearchSelectorType, appType, bookSearchType, tagsType, subjectsSelectorType, tagsSelectorType, bookSearchUiViewType>(
    state => state.app,
    state => state.booksModule.bookSearch,
    state => state.booksModule.tags,
    subjectsSelector,
    tagsSelector,
    bookSearchUiViewSelector,
    (app, bookSearch, tags, subjectsState, tagsState, searchUi) => {

        let bindableSortValue = !bookSearch.sort ? '_id|desc' : `${bookSearch.sort}|${bookSearch.sortDirection == '1' ? 'asc' : 'desc'}`;

        return {
            ...bookSearch,
            selectedSubjects: projectSelectedItems(bookSearch.subjects, app.subjectHash),
            selectedTags: projectSelectedItems(bookSearch.tags, tags.tagHash),
            pendingSelectedSubjects: projectSelectedItems(bookSearch.pending.subjects, app.subjectHash),
            pendingSelectedTags: projectSelectedItems(bookSearch.pending.tags, tags.tagHash),
            eligibleFilterSubjects: filterSubjects(subjectsState.subjectsUnwound, bookSearch.searchSubjectsValue),
            eligibleFilterTags: filterSubjects(tagsState.allTagsSorted, bookSearch.searchTagsValue),
            bindableSortValue,
            ...searchUi
        };
});