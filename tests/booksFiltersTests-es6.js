const { toggleFilteredSubject, applyPendingFilteredSubjects, cancelPendingFilteredSubjects } = require('../react-redux/modules/bookList/actions/actionCreators');

const assert = require('chai').assert;
const { filtersReducer, filtersSelector } = require('../react-redux/modules/bookList/reducers/filtersReducer');

function apply(...actions){
    let state = filtersReducer(undefined);
    actions.forEach(a => state = filtersReducer(state, a));

    return filtersSelector({ filters: state, subjects: { list: { 1: { name: 'Subject 1' } } } });
}