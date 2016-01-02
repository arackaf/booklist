const { TOGGLE_FILTERED_SUBJECT } = require('../actions/actionNames');

const initialState = () => ({
    searchText: '',
    subjects: {},
    withChildSubjects: false
});

function filtersReducer(state = initialState(), action = {}){
    switch(action.type){
        case TOGGLE_FILTERED_SUBJECT:
            return Object.assign({}, state, { subjects: { ...subjects, [action._id]: !state.subjects[action._id] } });
    }
    return state;
}

module.exports = filtersReducer;