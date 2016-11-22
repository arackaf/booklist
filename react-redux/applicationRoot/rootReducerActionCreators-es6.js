import {
    SET_DESKTOP,
    SET_MOBILE,
    REQUEST_DESKTOP,
    REQUEST_MOBILE,
    LOAD_SUBJECTS,
    LOAD_SUBJECTS_RESULTS,
    LOAD_COLORS
} from './rootReducerActionNames';

export const setDesktop = () => ({ type: SET_DESKTOP });
export const setMobile = () => ({ type: SET_MOBILE });

export const requestDesktop = () => ({ type: REQUEST_DESKTOP });
export const requestMobile = () => ({ type: REQUEST_MOBILE });

export function loadSubjects(){
    return function(dispatch, getState){
        let publicUserId = getState().app.publicUserId;

        dispatch({ type: LOAD_SUBJECTS });

        Promise.resolve(ajaxUtil.get('/subject/all', { userId: publicUserId })).then(subjectsResp => {
            dispatch({type: LOAD_SUBJECTS_RESULTS, subjects: subjectsResp.results});
            dispatch({type: LOAD_COLORS, colors: subjectsResp.colors });
        });
    }
}