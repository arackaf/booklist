import {USER_INFO_LOADING, USER_INFO_LOADED} from './actionNames';
const defaultState = {
    loading: true,
    isPublic: false,
    publicBooksHeader: '',
    publicName: ''
}

export default (state = defaultState, action) => {
    switch (action.type){
        case USER_INFO_LOADING: 
            return {...state, loading: true};
        case USER_INFO_LOADED: 
            return {...state, loading: false, ...action.info};
    }
    return state;
};

export const selector = state => state.settingsModule.userSettings;