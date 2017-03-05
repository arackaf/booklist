import SettingsComponent from './components/settingsComponent';
import {reducer} from './reducers/reducer';

export default {
    name: 'settings',
    reducer: reducer,
    component: SettingsComponent,
    //initialize: loadSubjects
};