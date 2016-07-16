import {
    LOAD_TAGS, LOAD_TAGS_RESULTS
} from './actionNames';

let tagsLoadedOrLoading = false;
export function loadTags(){
    return function(dispatch, getState){
        if (tagsLoadedOrLoading) return;
        tagsLoadedOrLoading = true;

        let publicUserId = getState().root.publicUserId;

        Promise.resolve(ajaxUtil.get('/tag/all', { userId: publicUserId })).then(tagsResp => {
            dispatch({type: LOAD_TAGS_RESULTS, tags: tagsResp.results});
            //dispatch({type: LOAD_COLORS, colors: tagsResp.colors });
        });
    }
}

