import {hashOf} from 'applicationRoot/rootReducer';
import {BooksModuleType, booksType, bookSearchType, editBookType, TagsType} from 'modules/books/reducers/reducer';
import {
    LOAD_TAGS, 
    LOAD_TAGS_RESULTS,
    UPDATE_TAG_RESULTS,
    TAG_DELETED
} from './actionNames';

import { createSelector, Selector } from 'reselect';
import {appType} from 'applicationRoot/rootReducer';
import update from 'immutability-helper';

interface ITag {
    _id: string;
    name: string;
}

const initialTagsState = {
    tagHash: hashOf<ITag>(),
    loaded: false,
};

export type TagsType = typeof initialTagsState;

export function tagsReducer(state = initialTagsState, action) : TagsType {
    switch(action.type){
        case LOAD_TAGS_RESULTS:
            return { ...state, tagHash: tagsToHash(action.tags), loaded: true };
        case UPDATE_TAG_RESULTS:
            return { ...state, tagHash: { ...state.tagHash, ...tagsToHash([action.tag]) } };
        case TAG_DELETED:
            return update(state, {tagHash: {$unset: [action._id]}})
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

function allTagssSorted(tagHash){
    let tags = Object.keys(tagHash).map(_id => tagHash[_id]);
    return tags.sort(({ name: name1 }, { name: name2 }) => {
        let name1After = name1.toLowerCase() > name2.toLowerCase(),
            bothEqual = name1.toLowerCase() === name2.toLowerCase();
        return bothEqual ? 0 : (name1After ? 1 : -1);
    });
}

export type TagsStateType = TagsType & {
    colors: object[],
    allTagsSorted: ITag[]
}

export const selectEntireTagsState = createSelector<BooksModuleType, TagsStateType, TagsType, object[]>(
    state => state.booksModule.tags,
    state => state.app.colors, 
    (tags, colors) => ({
        ...tags,
        colors,
        allTagsSorted: allTagssSorted(tags.tagHash)
    })
);
