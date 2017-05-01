import SubjectsList from './components/subjectsList';
import { reducer } from './reducers/reducer';
import { loadSubjects } from 'applicationRoot/rootReducerActionCreators'

export default {
    name: 'subjects',
    reducer: reducer,
    component: SubjectsList,
    initialize: loadSubjects
};