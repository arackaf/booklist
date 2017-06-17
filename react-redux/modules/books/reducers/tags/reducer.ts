import {hashOf} from 'applicationRoot/rootReducer';
import {BooksModuleType, booksType, bookSearchType, booksSubjectMofificationType, booksTagModificationType, editBookType, subjectsType, tagsType} from 'modules/books/reducers/reducer';
import {
    LOAD_TAGS, 
    LOAD_TAGS_RESULTS,
    UPDATE_TAG_RESULTS,
    TAG_DELETING, 
    TAG_DELETED
} from './actionNames';

import { createSelector, Selector } from 'reselect';
import {appType} from 'applicationRoot/rootReducer';

interface ITag {
    _id: string;
    name: string;
}

const initialTagsState = {
    tagHash: hashOf<ITag>(),
    loaded: false,
    deleting: false,
    deletingTagId: null,
    saving: false
};

export type tagsType = typeof initialTagsState;

export function tagsReducer(state = initialTagsState, action) : tagsType {
    switch(action.type){
        case LOAD_TAGS_RESULTS:
            return { ...state, tagHash: tagsToHash(action.tags), loaded: true };
        case UPDATE_TAG_RESULTS:
            return { ...state, tagHash: { ...state.tagHash, ...tagsToHash([action.tag]) } };
        case TAG_DELETING:
            return { ...state, deleting: true };
        case TAG_DELETED:
            let tagHash = { ...state.tagHash };
            delete tagHash[action._id];
            return { ... state, deleting: false, deletingTagId: null, tagHash };
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

export type EntireTagsStateType = tagsType & allTagsSortedType & {
    colors: object[]
}

export const selectEntireTagsState = createSelector<BooksModuleType, EntireTagsStateType, allTagsSortedType, tagsType, object[]>(
    selectAllTagsSorted,
    state => state.booksModule.tags,
    state => state.app.colors, 
    (allTagsSorted, tags, colors) => ({
        ...allTagsSorted,
        ...tags,
        colors
    })
);
