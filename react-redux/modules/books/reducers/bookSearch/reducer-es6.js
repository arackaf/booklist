import { LOAD_BOOKS, SET_FILTERS } from '../actionNames';
import { BEGIN_FILTER_CHANGE, TOGGLE_PENDING_SUBJECT, END_FILTER_CHANGE, SET_SORT_DIRECTION } from './actionNames';

const initialState = {
    searchText: '',
    subjects: {},
    sort: '',
    sortDirection: '',
    searchChildSubjects: false,
    isDirty: false,
    editingFilters: false,
    pendingSubjects: {}
};

function bookSearchReducer(state = initialState, action){
    switch(action.type){
        case SET_FILTERS:
            let newIsDirty =
                state.searchText != action.text ||
                subjectsDifferent(state.subjects, action.subjects) ||
                state.searchChildSubjects != action.searchChildSubjects;

            return Object.assign({},
                state,
                {
                    searchText: action.text,
                    subjects: { ...action.subjects },
                    searchChildSubjects: action.searchChildSubjects,
                    isDirty: newIsDirty
                }
            );
        case LOAD_BOOKS:
            return Object.assign({}, state, { isDirty: false });
        case SET_SORT_DIRECTION:
            return Object.assign({}, state, { sort: action.sort, sortDirection: action.direction, isDirty: true });
        case BEGIN_FILTER_CHANGE:
            return Object.assign({}, state, { editingFilters: true, pendingSubjects: { ...state.subjects } });
        case TOGGLE_PENDING_SUBJECT:
            return Object.assign({}, state, { editingFilters: true, pendingSubjects: { ...state.pendingSubjects, [action._id]: !state.pendingSubjects[action._id] } });
        case END_FILTER_CHANGE:
            return Object.assign({}, state, { editingFilters: false });
    }
    return state;
}

function subjectsDifferent(oldSubjects, newSubjects){
    return Object.keys(oldSubjects).filter(k => oldSubjects[k]).sort().join('-') !== Object.keys(newSubjects).filter(k => newSubjects[k]).sort().join('-');
}

function projectselectedSubjects(selectedSubjectsIds, subjects){
    //last filter since subjects might not be loaded yet
    return Object.keys(selectedSubjectsIds).filter(k => selectedSubjectsIds[k]).map(_id => subjects[_id]).filter(s => s);
}

const bookSearchSelector = state => Object.assign({}, state.bookSearch, { selectedSubjects: projectselectedSubjects(state.bookSearch.subjects, state.subjects.subjectHash) });

module.exports = { bookSearchReducer, bookSearchSelector };