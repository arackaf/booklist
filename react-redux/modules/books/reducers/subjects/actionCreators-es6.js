import { LOAD_SUBJECTS, LOAD_SUBJECTS_RESULTS } from './actionNames';

export function loadSubjects(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_SUBJECTS });

        Promise.resolve(ajaxUtil.get('/subject/all')).then(subjectsResp => {
            dispatch({type: LOAD_SUBJECTS_RESULTS, subjects: subjectsResp.results});
        });
    }
}