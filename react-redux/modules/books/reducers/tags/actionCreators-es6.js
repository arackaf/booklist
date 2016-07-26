import {
    LOAD_TAGS, LOAD_TAGS_RESULTS, EDIT_TAG, NEW_TAG, EDIT_TAGS, SET_NEW_TAG_VALUE,
    STOP_EDITING_TAGS, UPDATE_TAG, UPDATE_TAG_RESULTS, LOAD_COLORS, CANCEL_TAG_EDIT,
    BEGIN_TAG_DELETE, CANCEL_TAG_DELETE, TAG_DELETING, TAG_DELETED, SET_TAG_SEARCH_VALUE
} from './actionNames';

export function loadTags(){
    return function(dispatch, getState){
        let publicUserId = getState().root.publicUserId;

        dispatch({ type: LOAD_TAGS });

        Promise.resolve(ajaxUtil.get('/tag/all', { userId: publicUserId })).then(tagsResp => {
            dispatch({type: LOAD_TAGS_RESULTS, tags: tagsResp.results});
            dispatch({type: LOAD_COLORS, colors: tagsResp.colors });
        });
    }
}

export function setTagSearchValue(value){
    return { type: SET_TAG_SEARCH_VALUE, value: value.target.value };
}

export function editTags(){
    return { type: EDIT_TAGS };
}

export function setNewTagName(value){
    return { type: SET_NEW_TAG_VALUE, field: 'name', value };
}

export function setNewTagBackgroundColor(value){
    return { type: SET_NEW_TAG_VALUE, field: 'backgroundColor', value };
}

export function setNewTagTextColor(value){
    return { type: SET_NEW_TAG_VALUE, field: 'textColor', value };
}

export function stopEditingTags(){
    return { type: STOP_EDITING_TAGS };
}

export function editTag(_id){
    return { type: EDIT_TAG, _id };
}

export function newTag(){
    return { type: NEW_TAG };
}

export function cancelTagEdit(){
    return { type: CANCEL_TAG_EDIT };
}

export function createOrUpdateTag(){
    return function(dispatch, getState) {
        let { editingTag, name, parentId, backgroundColor, textColor } = getState().booksModule.tags.editTagPacket,
            request = { _id: editingTag ? editingTag._id : null, name, parentId, backgroundColor, textColor };

        ajaxUtil.post('/tag/setInfo', request, resp => dispatch({ type: UPDATE_TAG_RESULTS, tag: resp.tag }));
    }
}

export function beginDeleteTag(_id){
    return { type: BEGIN_TAG_DELETE, _id };
}

export function cancelDeleteTag(){
    return { type: CANCEL_TAG_DELETE };
}

export function deleteTag(_id){
    return function(dispatch, getState) {
        let request = { _id: _id + '' };
        dispatch({ type: TAG_DELETING });
        ajaxUtil.post('/tag/delete', request, resp => {
            dispatch({ type: TAG_DELETED, _id });
        });
    }
}