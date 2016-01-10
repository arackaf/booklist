const { TOGGLE_FILTERED_SUBJECT, SET_TEXT_SEARCH, APPLY_PENDING_FILTERED_SUBJECTS, CANCEL_PENDING_FILTERED_SUBJECTS } = require('../actions/actionNames');

const initialState = () => ({
    searchText: '',
    subjects: {},
    pendingSubjects: {},
    withChildSubjects: false
});

function filtersReducer(state = initialState(), action = {}){
    switch(action.type){
        case TOGGLE_FILTERED_SUBJECT:
            return Object.assign({}, state, { pendingSubjects: { ...state.pendingSubjects, [action._id]: !state.pendingSubjects[action._id] } });
        case APPLY_PENDING_FILTERED_SUBJECTS:
            return Object.assign({}, state, { subjects: { ...state.pendingSubjects } });
        case CANCEL_PENDING_FILTERED_SUBJECTS:
            return Object.assign({}, state, { pendingSubjects: { ...state.subjects } });
        case SET_TEXT_SEARCH:
            return Object.assign({}, state, { searchText: action.value });
    }
    return state;
}

function projectselectedSubjects(selectedSubjectsIds, subjects){
    return Object.keys(selectedSubjectsIds).filter(k => selectedSubjectsIds[k]).map(_id => subjects[_id]);
}

const filtersSelector = state => Object.assign({}, state.filters, { selectedSubjects: projectselectedSubjects(state.filters.subjects, state.subjects.list) });

module.exports = { filtersReducer, filtersSelector };