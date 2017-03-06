import {LOAD_USER_INFO, USER_INFO_LOADING, USER_INFO_LOADED} from './actionNames';

export function loadUserSettings(){
    return (dispatch, getState) => {
        dispatch({type: USER_INFO_LOADING});
        ajaxUtil.post('/user/getBasicUserInfo', {}, resp => {
            dispatch({type: USER_INFO_LOADED, info: resp.info});
        });
    }
}