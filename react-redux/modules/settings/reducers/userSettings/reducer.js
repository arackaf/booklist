import {createSelector} from 'reselect';
import {USER_INFO_LOADING, USER_INFO_LOADED, SET_EDITING_INFO} from './actionNames';
const defaultState = {
    loading: true,
    isPublic: false,
    publicBooksHeader: '',
    publicName: '',
    editing: {
        publicBooksHeader: '',
        publicName: ''
    }
}

export default (state = defaultState, action) => {
    switch (action.type){
        case USER_INFO_LOADING: 
            return {...state, loading: true};
        case USER_INFO_LOADED: 
            return {...state, loading: false, ...action.info, editing: {...action.info}};
        case SET_EDITING_INFO:
            return {...state, editing: {...state.editing, [action.name]: action.value}};
    }
    return state;
};

const dirtyProps = ['isPublic', 'publicName', 'publicBooksHeader'];
export const selector = createSelector([
    state => state.settingsModule.userSettings
], (userSettings) => ({
    ...userSettings,
    isDirty: dirtyProps.some(p => userSettings[p] != userSettings.editing[p])
}));
