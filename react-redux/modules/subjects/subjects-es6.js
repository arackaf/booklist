import SubjectsList from './components/subjectsList';
import { reducer, selector } from './reducers/reducer';
import { loadSubjects } from './reducers/actionCreators'

export default {
    name: 'subjects',
    reducer: reducer,
    component: SubjectsList,
    initialize: loadSubjects
};