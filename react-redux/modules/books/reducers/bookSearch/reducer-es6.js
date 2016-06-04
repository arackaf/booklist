import { BEGIN_FILTER_CHANGE, TOGGLE_PENDING_SUBJECT, END_FILTER_CHANGE, SET_SORT_DIRECTION, SET_FILTERS, SET_PENDING_SEARCH, SET_PENDING_CHILD_SUBJECTS } from './actionNames';

const initialState = {
    searchText: '',
    subjects: {},
    sort: '',
    sortDirection: '',
    searchChildSubjects: false,
    editingFilters: false,
    pendingSearchChildSubjects: false,
    pendingSubjects: {},
    pendingSearch: ''
};

function bookSearchReducer(state = initialState, action){
    switch(action.type){
        case SET_FILTERS:
            return Object.assign({},
                state,
                {
                    searchText: action.text,
                    pendingSearch: action.text,
                    subjects: { ...action.subjects },
                    searchChildSubjects: !!action.searchChildSubjects,
                    pendingSearchChildSubjects: !!action.searchChildSubjects
                }
            );
        case SET_SORT_DIRECTION:
            return Object.assign({}, state, { sort: action.sort, sortDirection: action.direction });
        case BEGIN_FILTER_CHANGE:
            return Object.assign({}, state, { editingFilters: true, pendingSubjects: { ...state.subjects } });
        case TOGGLE_PENDING_SUBJECT:
            return Object.assign({}, state, { editingFilters: true, pendingSubjects: { ...state.pendingSubjects, [action._id]: !state.pendingSubjects[action._id] } });
        case SET_PENDING_SEARCH:
            return Object.assign({}, state, { pendingSearch: action.value });
        case SET_PENDING_CHILD_SUBJECTS:
            return Object.assign({}, state, { pendingSearchChildSubjects: action.value });
        case END_FILTER_CHANGE:
            return Object.assign({}, state, { editingFilters: false });
    }
    return state;
}

function projectselectedSubjects(selectedSubjectsIds, subjects){
    //last filter since subjects might not be loaded yet
    return Object.keys(selectedSubjectsIds).filter(k => selectedSubjectsIds[k]).map(_id => subjects[_id]).filter(s => s);
}

const bookSearchSelector = state => Object.assign({}, state.bookSearch, { selectedSubjects: projectselectedSubjects(state.bookSearch.subjects, state.subjects.subjectHash) });

module.exports = { bookSearchReducer, bookSearchSelector };