import {
    ENABLE_TAG_MODIFICATION_FOR_SINGLE_BOOK,
    ENABLE_TAG_MODIFICATION_FOR_TOGGLED_BOOKS,
    SETTING_BOOKS_TAGS,
    SET_BOOKS_TAGS,
    CANCEL_BOOKS_TAG_MODIFICATION,
    FINISHED_TAG_MODIFICATION,
    ADDING_TAG_SEARCH_CHANGE,
    REMOVING_TAG_SEARCH_CHANGE,
    ADDING_TAG_SET,
    REMOVING_TAG_SET,
    RESET_TAGS
} from './actionNames';

import ajaxUtil from 'util/ajaxUtil';

export function cancelBookTagModification(){
    return { type: CANCEL_BOOKS_TAG_MODIFICATION }
}

export function setBooksTags(books, add, remove){
    return function(dispatch, getState){
        dispatch({ type: SETTING_BOOKS_TAGS });
        ajaxUtil.post('/bookBulk/setTags', { books, add, remove }, resp => {
            dispatch({ type: SET_BOOKS_TAGS, books, add, remove });
            dispatch({ type: FINISHED_TAG_MODIFICATION });
        });
    }
}

export function enableTagModificationSingleBook(_id){
    return { type: ENABLE_TAG_MODIFICATION_FOR_SINGLE_BOOK, _id }
}

export function enableTagModificationToggledBooks(){
    return { type: ENABLE_TAG_MODIFICATION_FOR_TOGGLED_BOOKS }
}

export function addingSearchValueChange(value){
    return { type: ADDING_TAG_SEARCH_CHANGE, value: value.target.value };
}

export function addingTagSet(value, tag){
    return { type: ADDING_TAG_SET, _id: tag._id, value };
}

export function removingSearchValueChange(value){
    return { type: REMOVING_TAG_SEARCH_CHANGE, value: value.target.value || '' };
}

export function removingTagSet(value, tag){
    return { type: REMOVING_TAG_SET, _id: tag._id, value };
}

export function resetTags(){
    return { type: RESET_TAGS };
}