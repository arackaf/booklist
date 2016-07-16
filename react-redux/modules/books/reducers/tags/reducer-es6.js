import {
    LOAD_TAGS_RESULTS
} from './actionNames';

const { createSelector } = require('reselect');

const initialTagsState = {
    tagHash: {},
    colors: [],
    loaded: false
};

export function tagsReducer(state = initialTagsState, action = {}){
    switch(action.type){
        case LOAD_TAGS_RESULTS:
            return Object.assign({}, state, { tagHash: tagsToHash(action.tags), loaded: true });
    }
    return state;
}

function tagsToHash(tags){
    let hash = {};
    tags.forEach(s => hash[s._id] = s);
    return hash;
}

export const tagsSelector = ({ booksModule }) => {
    return Object.assign({}, booksModule.tags, { allTagsSorted: allTagssSorted(booksModule.tags.tagHash) });
}

function allTagssSorted(tagHash){
    let tags = Object.keys(tagHash).map(_id => tagHash[_id]);
    return tags.sort(({ name: name1 }, { name: name2 }) => {
        let name1After = name1.toLowerCase() > name2.toLowerCase(),
            bothEqual = name1.toLowerCase() === name2.toLowerCase();
        return bothEqual ? 0 : (name1After ? 1 : -1);
    });
}