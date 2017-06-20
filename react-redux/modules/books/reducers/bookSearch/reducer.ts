import {BooksModuleType, AppType, bookSearchType, TagsType} from 'modules/books/reducers/reducer';

import {
    BEGIN_FILTER_CHANGE,
    SET_PENDING_SUBJECT,
    END_FILTER_CHANGE,
    SET_FILTERS,
    SET_PENDING,
    SET_VIEWING_USERID,
    SET_PENDING_TAG,
    SET_GRID_VIEW,
    SET_BASIC_LIST_VIEW,
    GRID_VIEW,
    BASIC_LIST_VIEW
} from './actionNames';

import { LOAD_BOOKS_RESULTS } from '../books/actionNames';
import {createSelector} from 'reselect';

import { selectStackedSubjects, StackedSubjectsType, filterSubjects as filterSubjectsOrTags } from '../subjects/reducer';
import { selectEntireTagsState, TagsStateType } from '../tags/reducer';

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
    view: ''
};
export type bookSearchType = typeof initialState;

export function bookSearchReducer(state = initialState, action) : bookSearchType {
    switch(action.type){
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

type lookupHashType = {
    [str: string] : tagOrSubject
}
type tagOrSubject = {
    _id: string,
    name: string
}

const createMemoizedPSI = (getActiveIds : ((state: BooksModuleType) => lookupHashType), getLookupHash : ((state: BooksModuleType) => lookupHashType)) => 
        createSelector<BooksModuleType, tagOrSubject[], lookupHashType, lookupHashType>(getActiveIds, getLookupHash, (ids, hash) => projectSelectedItems(ids, hash));

const selectSelectedSubjects = createMemoizedPSI(state => state.booksModule.bookSearch.subjects, state => state.app.subjectHash);
const selectSelectedTags = createMemoizedPSI(state => state.booksModule.bookSearch.tags, state => state.booksModule.tags.tagHash);
const selectPendingSelectedSubjects = createMemoizedPSI(state => state.booksModule.bookSearch.pending.subjects, state => state.app.subjectHash);
const selectPendingSelectedTags = createMemoizedPSI(state => state.booksModule.bookSearch.pending.tags, state => state.booksModule.tags.tagHash);

export type bookSearchUiViewType = {
    isGridView: boolean;
    isBasicList: boolean;
}
export const selectBookSearchUiView = createSelector<BooksModuleType, bookSearchUiViewType, AppType, bookSearchType>(
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

export type entireBookSearchStateType = bookSearchType & bookSearchUiViewType & {
    allTagsSorted: tagOrSubject[];

    pendingSelectedSubjects: tagOrSubject[];
    pendingSelectedTags: tagOrSubject[];
    selectedSubjects: tagOrSubject[];
    subjectsUnwound: tagOrSubject[];
    selectedTags: tagOrSubject[];
    bindableSortValue: any;
    anyActiveFilters: boolean;

};
export const selectEntireBookSearchState = createSelector<BooksModuleType, entireBookSearchStateType, TagsStateType, StackedSubjectsType, tagOrSubject[], tagOrSubject[], tagOrSubject[], tagOrSubject[], bookSearchType, bookSearchUiViewType>(
    selectEntireTagsState,
    selectStackedSubjects,
    selectSelectedSubjects, 
    selectSelectedTags, 
    selectPendingSelectedSubjects, 
    selectPendingSelectedTags,    
    state => state.booksModule.bookSearch,
    selectBookSearchUiView,
    (tagsState, subjectsState, selectedSubjects, selectedTags, pendingSelectedSubjects, pendingSelectedTags, bookSearch, searchUi) => {

        let bindableSortValue = !bookSearch.sort ? '_id|desc' : `${bookSearch.sort}|${bookSearch.sortDirection == '1' ? 'asc' : 'desc'}`;

        let filtersToCheckAgainstDefault = ['search', 'author', 'publisher', 'pages', 'isRead'];
        let anyActiveFilters = filtersToCheckAgainstDefault.find(k => bookSearch[k] != initialState[k]) 
                || (!!bookSearch.searchChildSubjects != !!initialState.searchChildSubjects)
                || (Object.keys(bookSearch.tags).length)
                || (Object.keys(bookSearch.subjects).length);

        return {
            ...bookSearch,
            subjectsUnwound: subjectsState.subjectsUnwound,
            allTagsSorted: tagsState.allTagsSorted,
            anyActiveFilters: !!anyActiveFilters,
            selectedSubjects,
            selectedTags,
            pendingSelectedSubjects, 
            pendingSelectedTags,
            bindableSortValue,
            ...searchUi
        };
});