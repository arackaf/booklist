import { createSelector } from 'reselect';

import {
    ENABLE_TAG_MODIFICATION_FOR_SINGLE_BOOK, ENABLE_TAG_MODIFICATION_FOR_TOGGLED_BOOKS, CANCEL_BOOKS_TAG_MODIFICATION, SET_BOOKS_TAGS,
    SETTING_BOOKS_TAGS, FINISHED_TAG_MODIFICATION, ADDING_TAG_SEARCH_CHANGE, REMOVING_TAG_SEARCH_CHANGE,
    ADDING_TAG_SET, REMOVING_TAG_SET, RESET_TAGS
} from './actionNames';

import { tagsSelector, filterTags } from '../tags/reducer';

const bookTagManagerInitialState = {
    singleBookModify: null,
    selectedBooksModify: false,
    addingTags: {},
    removingTags: {},
    settingBooksTags: false,
    addingTagSearch: '',
    removingTagSearch: ''
};

export function bookTagManagerReducer(state = bookTagManagerInitialState, action){
    switch (action.type){
        case SETTING_BOOKS_TAGS:
            return Object.assign({}, state, { settingBooksTags: true });
        case SET_BOOKS_TAGS:
            return Object.assign({}, state, { settingBooksTags: false });
        case ENABLE_TAG_MODIFICATION_FOR_SINGLE_BOOK:
            return Object.assign({}, state, { singleBookModify: action._id });
        case ENABLE_TAG_MODIFICATION_FOR_TOGGLED_BOOKS:
            return Object.assign({}, state, { selectedBooksModify: true });
        case CANCEL_BOOKS_TAG_MODIFICATION:
            return Object.assign({}, state, { singleBookModify: null, selectedBooksModify: false });
        case FINISHED_TAG_MODIFICATION:
            return Object.assign({}, state, { addingTags: {}, removingTags: {}, singleBookModify: null, selectedBooksModify: false });
        case ADDING_TAG_SEARCH_CHANGE:
            return Object.assign({}, state, { addingTagSearch: action.value });
        case ADDING_TAG_SET:
            return Object.assign({}, state, { addingTagSearch: '', addingTags: { ...state.addingTags, [action._id]: action.value } });
        case REMOVING_TAG_SEARCH_CHANGE:
            return Object.assign({}, state, { removingTagSearch: action.value });
        case REMOVING_TAG_SET:
            return Object.assign({}, state, { removingTagSearch: '', removingTags: { ...state.removingTags, [action._id]: action.value } })
        case RESET_TAGS:
            return Object.assign({}, state, { addingTags: {}, removingTags: {} });
    }
    return state;
}

export const modifyingBooksSelector = createSelector(
    [
        ({ booksModule }) => booksModule.booksTagsModifier.singleBookModify,
        ({ booksModule }) => booksModule.booksTagsModifier.selectedBooksModify,
        ({ booksModule }) => booksModule.books
    ],
    (singleBookModify, selectedBooksModify, books) => {
        let modifyingBookIds = singleBookModify ? [singleBookModify] : (selectedBooksModify ? Object.keys(books.selectedBooks).filter(k => books.selectedBooks[k]) : []);
        return modifyingBookIds.filter(_id => _id).map(_id => books.booksHash[_id]);
    }
);

const addingTagsSelector = createSelector(
    [
        ({ booksModule }) => booksModule.booksTagsModifier.addingTags,
        ({ booksModule }) => booksModule.booksTagsModifier.addingTagSearch,
        ({ booksModule }) => booksModule.tags.tagHash,
        tagsSelector
    ],
    (adding, addingTagSearch, tags, tagsSelected) => ({
        addingTags: Object.keys(adding).filter(_id => adding[_id]).map(_id => tags[_id]),
        eligibleToAdd: filterTags(tagsSelected.allTagsSorted, addingTagSearch)
    })
);

const removingTagsSelector = createSelector(
    [
        ({ booksModule }) => booksModule.booksTagsModifier.removingTags,
        ({ booksModule }) => booksModule.booksTagsModifier.removingTagSearch,
        ({ booksModule }) => booksModule.tags.tagHash,
        tagsSelector
    ],
    (removing, removingTagSearch, tags, tagsSelected) => ({
        removingTags: Object.keys(removing).filter(_id => removing[_id]).map(_id => tags[_id]),
        eligibleToRemove: filterTags(tagsSelected.allTagsSorted, removingTagSearch)
    })
);

export const booksTagsModifierSelector = createSelector(
    [
        ({ booksModule }) => booksModule.booksTagsModifier,
        modifyingBooksSelector,
        addingTagsSelector,
        removingTagsSelector,
        tagsSelector
    ],
    (booksTagsModifier, modifyingBooks, { addingTags, eligibleToAdd }, { removingTags, eligibleToRemove }, tagsState) => ({
        addingTagIds: booksTagsModifier.addingTags,
        removingTagIds: booksTagsModifier.removingTags,
        settingBooksTags: booksTagsModifier.settingBooksTags,
        modifyingBooks,
        addingTags,
        eligibleToAdd,
        removingTags,
        eligibleToRemove,
        tags: tagsState.tags,
        allTagsSorted: tagsState.allTagsSorted,
        addingTagSearch: booksTagsModifier.addingTagSearch,
        removingTagSearch: booksTagsModifier.removingTagSearch
    })
);