import {LOAD_USER_INFO, USER_INFO_LOADING, USER_INFO_LOADED, SET_EDITING_INFO} from './actionNames';

export function loadUserSettings(){
    return (dispatch, getState) => {
        dispatch({type: USER_INFO_LOADING});
        ajaxUtil.post('/user/getBasicUserInfo', {}, resp => {
            dispatch({type: USER_INFO_LOADED, info: resp.info});
        });
    }
}

const createEditingChange = (name, evtName = 'value') => evt => dispatch => dispatch({type: SET_EDITING_INFO, name, value: evt.target[evtName]});

export const editIsPublic = createEditingChange('isPublic', 'checked');
export const editPublicName = createEditingChange('publicName');
export const editPublicBooksHeader = createEditingChange('publicBooksHeader');