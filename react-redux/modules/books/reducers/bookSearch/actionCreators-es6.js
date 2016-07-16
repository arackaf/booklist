import {
    BEGIN_FILTER_CHANGE,
    SET_PENDING_SUBJECT,
    SET_PENDING_TAG,
    END_FILTER_CHANGE,
    SET_SORT_DIRECTION,
    SET_FILTERS,
    SET_PENDING,
    APPLY_PENDING_SEARCH,
    SET_VIEWING_USERID,
    SET_SEARCH_SUBJECTS_VALUE,
    SET_SEARCH_TAGS_VALUE
} from './actionNames';

import { loadBooks } from '../books/actionCreators';

import { globalHashManager } from 'reactStartup';

export function beginFilterChange(){
    return { type: BEGIN_FILTER_CHANGE };
}

export function setSearchSubjectsValue(obj){
    return { type: SET_SEARCH_SUBJECTS_VALUE, value: obj.target.value || '' };
}

export function setSearchTagsValue(obj){
    return { type: SET_SEARCH_TAGS_VALUE, value: obj.target.value || '' };
}

export function addPendingSubject({ _id }){
    return { type: SET_PENDING_SUBJECT, _id, value: true };
}

export function removePendingSubject(_id){
    return { type: SET_PENDING_SUBJECT, _id, value: false };
}

export function addPendingTag({ _id }){
    return { type: SET_PENDING_TAG, _id, value: true };
}

export function removePendingTag(_id){
    return { type: SET_PENDING_TAG, _id, value: false };
}

export function endFilterChanging(){
    return { type: END_FILTER_CHANGE };
}

export function applyFilters(){
    return function(dispatch, getState) {
        let state = getState().booksModule.bookSearch,
            filterSubjectsVal = Object.keys(state.pending.subjects).filter(k => state.pending.subjects[k]).join('-'),
            filterTagsVal = Object.keys(state.pending.tags).filter(k => state.pending.tags[k]).join('-'),
            pending = state.pending;

        globalHashManager.setValues(
            'search', pending.search,
            'subjects', filterSubjectsVal,
            'tags', filterTagsVal,
            'searchChildSubjects', pending.searchChildSubjects && filterSubjectsVal ? 'true' : null,
            'author', pending.author,
            'publisher', pending.publisher,
            'pagesOperator', pending.pages != '' ? pending.pagesOperator : null,
            'pages', pending.pages
        );
        dispatch(endFilterChanging());
    }
}

export function setSortOrder(sort, direction){
    return function(dispatch, getState){
        globalHashManager.setValues(
            'sort', sort,
            'sortDirection', direction == 1 ? 'asc' : 'desc'
        );
    };
}
let initial = true;
export function syncFiltersToHash(){
    return function(dispatch, getState){
        let state = getState(),
            root = state.root,
            bookSearch = state.booksModule.bookSearch;

        let subjects = {},
            selectedSubjectsHashString = globalHashManager.getCurrentHashValueOf('subjects');
        if (selectedSubjectsHashString){
            selectedSubjectsHashString.split('-').forEach(_id => subjects[_id] = true);
        }
        let searchChildSubjects = globalHashManager.getCurrentHashValueOf('searchChildSubjects') ? true : null;
        let tags = {},
            selectedTagsHashString = globalHashManager.getCurrentHashValueOf('tags');

        if (selectedTagsHashString){
            selectedTagsHashString.split('-').forEach(_id => tags[_id] = true);
        }
        let packet = { searchChildSubjects, subjects, tags };

        if ((root.publicUserId || '') != (globalHashManager.getCurrentHashValueOf('userId') || '')){
            location.reload();
            return;
        }

        ['search', 'author', 'publisher', 'pages', 'pagesOperator', 'sort'].forEach(prop => packet[prop] = globalHashManager.getCurrentHashValueOf(prop) || '');
        packet.sortDirection = globalHashManager.getCurrentHashValueOf('sortDirection') == 'asc' ? 1 : -1;
        let newIsDirty = isDirty(bookSearch, packet);

        if (initial || newIsDirty) {
            dispatch(setFilters(packet));

            dispatch(loadBooks());
        }
        initial = false;
    };
}

export function setFilters(packet){
    return { type: SET_FILTERS, packet }
}

function isDirty(oldState, newState){
    if (itemsDifferent(oldState.subjects, newState.subjects)) return true;
    if (itemsDifferent(oldState.tags, newState.tags)) return true;
    if (oldState.pagesOperator != newState.pagesOperator){
        if (newState.pages !== '') return true;
    }

    return !!['search', 'author', 'publisher', 'pages', 'sort', 'sortDirection'].filter(prop => oldState[prop] != newState[prop]).length;
}

function itemsDifferent(oldItems, newItems){
    return Object.keys(oldItems).filter(k => oldItems[k]).sort().join('-') !== Object.keys(newItems).filter(k => newItems[k]).sort().join('-');
}

export function removeFilterSubject(_id) {
    return function(dispatch, getState) {
        let state = getState().booksModule.bookSearch,
            newSubjects = Object.keys(state.subjects).filter(sId => sId != _id).join('-');

        globalHashManager.setValues(
            'subjects', newSubjects,
            'searchChildSubjects', state.searchChildSubjects && newSubjects ? 'true' : null
        );
    };
}

function createPendingActionCreator(name, getEvtValue = evt => evt.target.value){
    return function (evt) {
        return function (dispatch, getState) {
            if (evt.which === 13){
                dispatch(applyFilters());
            } else {
                dispatch({type: SET_PENDING, field: name, value: getEvtValue(evt)})
            }
        };
    }
}

export const setPendingSearch = createPendingActionCreator('search');
export const setPendingSubjects = createPendingActionCreator('subjects');
export const setPendingSearchChildSubjects = createPendingActionCreator('searchChildSubjects', evt => evt.target.checked);
export const setPendingAuthor = createPendingActionCreator('author');
export const setPendingPublisher = createPendingActionCreator('publisher');
export const setPendingPages = createPendingActionCreator('pages');
export const setPendingPagesOperator = createPendingActionCreator('pagesOperator');

export function setViewingUserId(_id){
    return { type: SET_VIEWING_USERID, _id }
}