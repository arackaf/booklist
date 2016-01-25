const { SET_TEXT_SEARCH, SET_FILTERED_SUBJECTS } = require('../actions/actionNames');

const initialState = {
    searchText: '',
    subjects: {},
    searchChildSubjects: false
};

function filtersReducer(state = initialState, action){
    switch(action.type){
        case SET_FILTERED_SUBJECTS:
            return Object.assign({}, state, { subjects: { ...action.subjects }, searchChildSubjects: action.searchChildSubjects });
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