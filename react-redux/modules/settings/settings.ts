import SettingsComponent from './components/settingsComponent';
import reducer, {initialize} from './reducers/reducer';

export default {
    name: 'settings',
    reducer,
    component: SettingsComponent,
    initialize
};