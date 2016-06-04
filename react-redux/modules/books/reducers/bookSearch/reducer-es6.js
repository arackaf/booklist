import { BEGIN_FILTER_CHANGE, TOGGLE_PENDING_SUBJECT, END_FILTER_CHANGE, SET_SORT_DIRECTION, SET_FILTERS } from './actionNames';

const initialState = {
    searchText: '',
    subjects: {},
    sort: '',
    sortDirection: '',
    searchChildSubjects: false,
    editingFilters: false,
    pendingSubjects: {}
};

function bookSearchReducer(state = initialState, action){
    switch(action.type){
        case SET_FILTERS:
            return Object.assign({},
                state,
                {
                    searchText: action.text,
                    subjects: { ...action.subjects },
                    searchChildSubjects: action.searchChildSubjects,
                }
            );
        case SET_SORT_DIRECTION:
            return Object.assign({}, state, { sort: action.sort, sortDirection: action.direction });
        case BEGIN_FILTER_CHANGE:
            return Object.assign({}, state, { editingFilters: true, pendingSubjects: { ...state.subjects } });
        case TOGGLE_PENDING_SUBJECT:
            return Object.assign({}, state, { editingFilters: true, pendingSubjects: { ...state.pendingSubjects, [action._id]: !state.pendingSubjects[action._id] } });
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