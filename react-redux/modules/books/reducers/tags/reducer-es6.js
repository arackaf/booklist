import {
    LOAD_TAGS_RESULTS, EDIT_TAG, NEW_TAG, EDIT_TAGS, SET_NEW_TAG_VALUE,
    STOP_EDITING_TAGS, UPDATE_TAG, UPDATE_TAG_RESULTS, LOAD_COLORS, CANCEL_TAG_EDIT,
    BEGIN_TAG_DELETE, CANCEL_TAG_DELETE, TAG_DELETING, TAG_DELETED
} from './actionNames';

const initialTagsState = {
    tagHash: {},
    colors: [],
    loaded: false
};

export function tagsReducer(state = initialTagsState, action = {}){
    switch(action.type){
        case LOAD_TAGS_RESULTS:
            return Object.assign({}, state, { tagHash: tagsToHash(action.tags), loaded: true });
        case EDIT_TAGS:
            return Object.assign({}, state, { editTagPacket: {  } });
        case SET_NEW_TAG_VALUE:
            return Object.assign({}, state, { editTagPacket: { ...state.editTagPacket, [action.field]: action.value } });
        case STOP_EDITING_TAGS:
            return Object.assign({}, state, { editTagPacket: null });
        case NEW_TAG:
            return Object.assign({}, state, { editTagPacket: { editing: true, editingTag: null, parentId: '', name: '' } });
        case EDIT_TAG:
            var editingTag = state.tagHash[action._id],
                parentId;

            if (editingTag.path == null){
                parentId = null;
            } else {
                let hierarchy = editingTag.path.split(',');
                parentId = hierarchy[hierarchy.length - 2];
            }

            return Object.assign({}, state, { editTagPacket: { editing: true, ...editingTag, parentId: parentId || '', editingTag } });
        case CANCEL_TAG_EDIT:
            return Object.assign({}, state, { editTagPacket: { ...state.editTagPacket, editing: false } });
        case UPDATE_TAG_RESULTS:
            let changedTags = tagsToHash([action.tag]);
            return Object.assign({}, state, { editTagPacket: Object.assign({}, state.editTagPacket, { editing: false, editingTag: null }), tagHash: Object.assign({}, state.tagHash, changedTags) });
        case BEGIN_TAG_DELETE:
            let childTagRegex = new RegExp(`.*,${action._id},.*`),
                affectedChildren = Object.keys(state.tagHash).filter(k => childTagRegex.test(state.tagHash[k].path)).length,
                tagName = state.tagHash[action._id].name;

            return Object.assign({}, state, { editTagPacket: { ...state.editTagPacket, deleteInfo: { affectedChildren, tagName, _id: action._id } } });
        case CANCEL_TAG_DELETE:
            return Object.assign({}, state, { editTagPacket: { ...state.editTagPacket, deleteInfo: null } });
        case TAG_DELETING:
            return Object.assign({}, state, { editTagPacket: { ...state.editTagPacket, deleteInfo: { ...state.editTagPacket.deleteInfo, deleting: true } } });
        case TAG_DELETED:
            let editTagPacket = Object.assign({}, state.editTagPacket, { editing: false });
            let tagHash = { ...state.tagHash };

            delete tagHash[action._id];

            return Object.assign({}, state, { editTagPacket, tagHash });
        case LOAD_COLORS:
            return Object.assign({}, state, { colors: action.colors });        
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

export const filterTags = (tags, search) => {
    if (!search){
        search = () => true;
    } else {
        let regex = new RegExp(search, 'i');
        search = txt => regex.test(txt);
    }
    return tags.filter(s => search(s.name))
};