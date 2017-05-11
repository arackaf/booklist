import SubjectsList from './components/subjectsList';
import { reducer } from './reducers/reducer';
import { loadSubjects } from 'applicationRoot/rootReducerActionCreators'

export default {
    reducer: reducer,
    component: SubjectsList,
    initialize: loadSubjects
};