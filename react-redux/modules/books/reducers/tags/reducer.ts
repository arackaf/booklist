import {hashOf} from 'applicationRoot/rootReducer';
import {BooksModuleType, booksType, bookSearchType, booksSubjectMofificationType, booksTagModificationType, editBookType, subjectsType, tagsType} from 'modules/books/reducers/reducer';
import {
    LOAD_TAGS, LOAD_TAGS_RESULTS, EDIT_TAG, NEW_TAG, EDIT_TAGS, SET_NEW_TAG_VALUE,
    STOP_EDITING_TAGS, UPDATE_TAG, UPDATE_TAG_RESULTS, CANCEL_TAG_EDIT,
    BEGIN_TAG_DELETE, CANCEL_TAG_DELETE, TAG_DELETING, TAG_DELETED, SET_TAG_SEARCH_VALUE
} from './actionNames';

import { createSelector, Selector } from 'reselect';
import {appType} from 'applicationRoot/rootReducer';

const emptyTag = { _id: '', name: '', backgroundColor: '', textColor: '' };
const newTagEditing = { tagSearch: '', deletingTagId: null };
const doneEditingTag = { saving: false, editingTagId: null, editingTag: null };

interface ITag {
    _id: string;
    name: string;
}

const initialTagsState = {
    tagHash: hashOf<ITag>(),
    loaded: false,
    tagSearch: '',
    editTagOpen: false,
    editingTag: null,
    editingTagId: null,
    deleting: false,
    deletingTagId: null
};

export type tagsType = typeof initialTagsState;

export function tagsReducer(state = initialTagsState, action) : tagsType {
    switch(action.type){
        case LOAD_TAGS_RESULTS:
            return { ...state, tagHash: tagsToHash(action.tags), loaded: true };
        case SET_TAG_SEARCH_VALUE:
            return { ...state, tagSearch: action.value };
        case EDIT_TAGS:
            return { ...state, editTagOpen: true };
        case SET_NEW_TAG_VALUE:
            return { ...state, editingTag: {...state.editingTag, [action.field]: action.value } };
        case STOP_EDITING_TAGS:
            return { ...state, editTagOpen: false };
        case NEW_TAG:
            return {...state, ...newTagEditing, editingTag: { ...emptyTag } };
        case EDIT_TAG:
            return { ...state, ...newTagEditing, editingTag: state.tagHash[action._id], editingTagId: action._id };
        case CANCEL_TAG_EDIT:
            return { ...state, ...doneEditingTag };
        case UPDATE_TAG_RESULTS:
            return { ...state, ...doneEditingTag, tagHash: { ...state.tagHash, ...tagsToHash([action.tag]) } };
        case BEGIN_TAG_DELETE:
            return { ...state, deletingTagId: action._id };
        case CANCEL_TAG_DELETE:
            return { ...state, deletingTagId: null };
        case TAG_DELETING:
            return { ...state, deleting: true };
        case TAG_DELETED:
            let tagHash = { ...state.tagHash };
            delete tagHash[action._id];
            let newState = { ... state, deleting: false, deletingTagId: null, tagHash };

            if (newState.editingTagId && !newState.tagHash[newState.editingTagId]){
                newState.editingTagId = newState.editingTag = null;
            }

            return newState;
    }
    return state;
}

const tagsToHash = tags => tags.reduce((hash, tag) => (hash[tag._id] = tag, hash), {});

export const filterTags = (tags, search) => {
    if (!search){
        search = () => true;
    } else {
        let regex = new RegExp(search, 'i');
        search = txt => regex.test(txt);
    }
    return tags.filter(s => search(s.name));
};

export type allTagsSortedType = {allTagsSorted: ITag[]};
export const selectAllTagsSorted = createSelector<BooksModuleType, allTagsSortedType, any>(
    state => state.booksModule.tags.tagHash,
    tagHash => {
        let allTagsSorted = allTagssSorted(tagHash);
        return { allTagsSorted };
    }
);


function allTagssSorted(tagHash){
    let tags = Object.keys(tagHash).map(_id => tagHash[_id]);
    return tags.sort(({ name: name1 }, { name: name2 }) => {
        let name1After = name1.toLowerCase() > name2.toLowerCase(),
            bothEqual = name1.toLowerCase() === name2.toLowerCase();
        return bothEqual ? 0 : (name1After ? 1 : -1);
    });
}

type tagsSearchedType = allTagsSortedType & {
    tagsSearched: ITag[]
}
const selectTagsSearched = createSelector<BooksModuleType, tagsSearchedType, allTagsSortedType, string>(
    selectAllTagsSorted,
    state => state.booksModule.tags.tagSearch,
    (tags, tagSearch) => {
        let tagsSearched = filterTags(tags.allTagsSorted, tagSearch);
        return { ...tags, tagsSearched };
    }
);

type deletingTagInfoType = {
    deleteInfo: {
        tagName: string,
        _id: string
    }
}
const selectDeletingTagInfo = createSelector<BooksModuleType, deletingTagInfoType, object, string>(
    state => state.booksModule.tags.tagHash,
    state => state.booksModule.tags.deletingTagId,
    (tagHash, deletingTagId) => {
        if (!deletingTagId) return null;

        let tagName = tagHash[deletingTagId].name;

        return { deleteInfo: { tagName, _id: deletingTagId } };
    }
);

export type entireTagsStateType = tagsType & tagsSearchedType & deletingTagInfoType & {
    colors: object[]
}
//TODO:

export const selectEntireTagsState = createSelector<BooksModuleType, entireTagsStateType, tagsType, any, tagsSearchedType, deletingTagInfoType>(
    state => state.booksModule.tags,
    state => state.app.colors, 
    selectTagsSearched,
    selectDeletingTagInfo,
    (tags, colors, searchedTags, deletingInfo) => ({
        ...tags,
        ...searchedTags, 
        ...deletingInfo,
        colors
    })
);
