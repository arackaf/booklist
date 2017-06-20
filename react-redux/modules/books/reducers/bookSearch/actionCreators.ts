import {store} from 'applicationRoot/store';
import {
    BEGIN_FILTER_CHANGE,
    SET_PENDING_SUBJECT,
    SET_PENDING_TAG,
    END_FILTER_CHANGE,
    SET_FILTERS,
    SET_PENDING,
    APPLY_PENDING_SEARCH,
    SET_VIEWING_USERID,
    SET_GRID_VIEW,
    SET_BASIC_LIST_VIEW,
    GRID_VIEW,
    BASIC_LIST_VIEW
} from './actionNames';

import { loadBooks } from '../books/actionCreators';
import { loadSubjects } from 'applicationRoot/rootReducerActionCreators';
import { loadTags } from '../tags/actionCreators';

import { setSearchValues, getCurrentHistoryState, history } from 'reactStartup';

export const setViewDesktop = view => ({ type: SET_GRID_VIEW });
export const setViewBasicList = view => ({ type: SET_BASIC_LIST_VIEW });

export function beginFilterChange(){
    return { type: BEGIN_FILTER_CHANGE };
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

        setSearchValues({
            'page': null,
            'search': pending.search,
            'subjects': filterSubjectsVal,
            'tags': filterTagsVal,
            'searchChildSubjects': pending.searchChildSubjects && filterSubjectsVal ? 'true' : null,
            'author': pending.author,
            'publisher': pending.publisher,
            'pagesOperator': pending.pages != '' ? pending.pagesOperator : null,
            'pages': pending.pages,
            'isRead': pending.isRead
        });
        dispatch(endFilterChanging());
    }
}

export function clearAllFilters(){
    return function(dispatch, getState) {
        setSearchValues({
            'page': null,
            'search': '',
            'subjects': '',
            'tags': '',
            'searchChildSubjects': null,
            'author': '',
            'publisher': '',
            'pagesOperator': null,
            'pages': '',
            'isRead': ''
        });
    }
}

export function setSortOrder(sort, direction){
    return function(dispatch, getState){
        setSearchValues({
            'sort': sort,
            'sortDirection': direction == 1 ? 'asc' : 'desc'
        });
    };
}

export function booksInitialized(searchProps){
    let isActive = true;
    history.listen((location, action) => {
        let {pathname, searchState} = getCurrentHistoryState();

        if (pathname === '/books' || pathname === '/view'){
            store.dispatch(syncFiltersToHash(searchState, { reactivating: !isActive }));
            isActive = true;
        } else {
            isActive = false;
        }
    })

    return function(dispatch, getState){
        let searchState = getCurrentHistoryState().searchState,
            nextSearchFilters = getNextFilters(searchState),
            state = getState(),
            subjectsState = state.booksModule.subjects,
            tagsState = state.booksModule.tags;

        dispatch(loadSubjects());
        dispatch(loadTags());

        dispatch(setFilters(nextSearchFilters));
        dispatch(loadBooks());
    }
}

export function syncFiltersToHash(searchProps, { reactivating = false } = {}){
    return function(dispatch, getState){
        let nextSearchFilters = getNextFilters(searchProps),
            state = getState(),
            searchState = state.booksModule.bookSearch,
            booksState = state.booksModule.books;

        if (!nextSearchFilters.sort){
            nextSearchFilters.sort = '_id';
        }
        if (!nextSearchFilters.sortDirection){
            nextSearchFilters.sortDirection = '-1';
        }
        let force = reactivating && booksState.reloadOnActivate;

        if (force || isDirty(searchState, nextSearchFilters)){
            dispatch(setFilters(nextSearchFilters));
            dispatch(loadBooks());
        }
    };
}

const getNextFilters = searchProps =>
    Object.assign({}, searchProps, {
        subjects: idStringToObject(searchProps.subjects),
        tags: idStringToObject(searchProps.tags),
        searchChildSubjects: searchProps.searchChildSubjects ? true : null,
        sortDirection: searchProps.sortDirection == 'asc' ? 1 : -1
    });

const idStringToObject = (str = '') => str.split('-').filter(s => s).reduce((obj, val) => (obj[val] = true, obj), {});

export function setFilters(packet){
    return { type: SET_FILTERS, packet }
}

function isDirty(oldState, newState){
    if (itemsDifferent(oldState.subjects, newState.subjects)) return true;
    if (itemsDifferent(oldState.tags, newState.tags)) return true;
    if (oldState.pagesOperator != (newState.pagesOperator || 'lt')){
        if (newState.pages !== '') return true;
    }
    if ((oldState.page || 1) != (newState.page || 1)){
        if (newState.pages !== '') return true;
    }
    if (!!oldState.searchChildSubjects != !!newState.searchChildSubjects){
        return true;
    }

    return !!['search', 'author', 'publisher', 'pages', 'sort', 'sortDirection', 'isRead'].filter(prop => oldState[prop] != (newState[prop] || '')).length;
}

const itemsDifferent = (oldItems, newItems) =>
    Object.keys(oldItems).filter(k => oldItems[k]).sort().join('-') !== Object.keys(newItems).filter(k => newItems[k]).sort().join('-');

export function removeFilterSubject(_id) {
    return function(dispatch, getState) {
        let state = getState().booksModule.bookSearch,
            newSubjects = Object.keys(state.subjects).filter(sId => sId != _id).join('-');

        setSearchValues({
            'subjects': newSubjects,
            'searchChildSubjects': state.searchChildSubjects && newSubjects ? 'true' : null
        });
    };
}

export function removeFilterTag(_id){
    return function(dispatch, getState) {
        let state = getState().booksModule.bookSearch,
            newTags = Object.keys(state.tags).filter(sId => sId != _id).join('-');

        setSearchValues({'tags': newTags});
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

export function clearSearchChildSubjects(){
    return function(dispatch, getState){
        dispatch({type: SET_PENDING, field: 'searchChildSubjects', value: null});
        dispatch(applyFilters());
    }
}

export function pageUp(){
    return function(dispatch, getState){
        let state = getState().booksModule.bookSearch;
        setSearchValues({'page': +state.page + 1});
    };
}

export function pageDown(){
    return function(dispatch, getState){
        let state = getState().booksModule.bookSearch;
        setSearchValues({'page': +state.page == 2 ? null : state.page - 1});
    };
}

export const setPendingSearch = createPendingActionCreator('search');
export const setPendingSubjects = createPendingActionCreator('subjects');
export const setPendingSearchChildSubjects = createPendingActionCreator('searchChildSubjects', evt => evt.target.checked);
export const setPendingAuthor = createPendingActionCreator('author');
export const setPendingPublisher = createPendingActionCreator('publisher');
export const setPendingPages = createPendingActionCreator('pages');
export const setPendingPagesOperator = createPendingActionCreator('pagesOperator');
export const setPendingIsRead = createPendingActionCreator('isRead');

export function setViewingUserId(_id){
    return { type: SET_VIEWING_USERID, _id }
}