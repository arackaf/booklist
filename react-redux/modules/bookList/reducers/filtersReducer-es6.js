const { TOGGLE_FILTERED_SUBJECT, SET_TEXT_SEARCH } = require('../actions/actionNames');

const initialState = () => ({
    searchText: '',
    subjects: {},
    withChildSubjects: false
});

function filtersReducer(state = initialState(), action = {}){
    switch(action.type){
        case TOGGLE_FILTERED_SUBJECT:
            return Object.assign({}, state, { subjects: { ...subjects, [action._id]: !state.subjects[action._id] } });
        case SET_TEXT_SEARCH:
            return Object.assign({}, state, { searchText: action.value });
    }
    return state;
}

module.exports = filtersReducer;