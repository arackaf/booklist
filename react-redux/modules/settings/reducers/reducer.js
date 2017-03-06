import {loadUserSettings} from './userSettings/actionCreators';
import { combineReducers } from 'redux';
import userSettings, {selector as userSettingsSelector} from './userSettings/reducer';

export default combineReducers({
    userSettings
});

export const selector = state => state;

export function initialize(){
    return (dispatch, getState) => {
        dispatch(loadUserSettings());
    }
}