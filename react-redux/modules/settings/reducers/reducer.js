import { combineReducers } from 'redux';
import userSettings, {selector as userSettingsSelector} from './userSettings/reducer';

export const reducer = combineReducers({
    userSettings
});

export const selector = state => state;
