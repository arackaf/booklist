import {createSelector} from 'reselect';
import {USER_INFO_LOADING, USER_INFO_LOADED, SET_EDITING_INFO, USER_INFO_SAVING, USER_INFO_SAVED} from './actionNames';
const defaultState = {
    loading: true,
    isPublic: false,
    publicBooksHeader: '',
    publicName: '',
    editing: {
        publicBooksHeader: '',
        publicName: ''
    },
    saving: false
}

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
export const selector = createSelector([
    state => state.settingsModule.publicUserSettings
], (publicUserSettings) => ({
    ...publicUserSettings,
    isDirty: dirtyProps.some(p => publicUserSettings[p] != publicUserSettings.editing[p])
}));
