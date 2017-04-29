import {appType} from 'applicationRoot/rootReducer';
import {createSelector} from 'reselect';
import {USER_INFO_LOADING, USER_INFO_LOADED, SET_EDITING_INFO, USER_INFO_SAVING, USER_INFO_SAVED} from './actionNames';
const defaultState = {
    loading: true,
    isPublic: false,
    publicBooksHeader: '',
    publicName: '',
    editing: {
        publicBooksHeader: '',
        publicName: '',
        isPublic: false
    },
    saving: false
}

export type publicUserSettingsType = typeof defaultState;

export default (state = defaultState, action) => {
    switch (action.type){
        case USER_INFO_LOADING: 
            return {...state, loading: true};
        case USER_INFO_LOADED: 
            return {...state, loading: false, ...action.info, editing: {...action.info}};
        case SET_EDITING_INFO:
            return {...state, editing: {...state.editing, [action.name]: action.value}};
        case USER_INFO_SAVING: 
            return {...state, saving: true};
        case USER_INFO_SAVED: 
            return {...state, saving: false, ...state.editing};
    }
    return state;
};

const dirtyProps = ['isPublic', 'publicName', 'publicBooksHeader'];
export type publicUserSettingsSelectorType = publicUserSettingsType & {
    isDirty: boolean,
    publicLink: string
}
type storeSlice = {app: appType, settingsModule: {publicUserSettings: publicUserSettingsType}};
export const selector = createSelector<storeSlice, publicUserSettingsSelectorType, appType, publicUserSettingsType>(
    state => state.app,
    state => state.settingsModule.publicUserSettings, 
    (app, publicUserSettings) => {
    let publicLink = '';
    if (publicUserSettings.isPublic){
        publicLink = `http://${window.location.host}/view?userId=${app.userId}`;
    }
    return {
        ...publicUserSettings,
        isDirty: dirtyProps.some(p => publicUserSettings[p] != publicUserSettings.editing[p]),
        publicLink
    }
});
