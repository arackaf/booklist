import { hashOf, getSearchVersion, TAGS_SEARCH_VERSION_KEY, ITag, objectsToHash, graphqlClient, getStatePacket } from "./rootReducer";
import update from "immutability-helper";

import GetTags from "graphQL/tags/getTags.graphql";
import UpdateTag from "graphQL/tags/updateTag.graphql";
import CreateTag from "graphQL/tags/createTag.graphql";
import DeleteTagMutation from "graphQL/tags/deleteTag.graphql";
import { useContext } from "react";
import { AppContext } from "./renderUI";
import { AppState } from "./appState";
import { useQuery, buildQuery } from "micro-graphql-react";

const LOAD_TAGS = "root.LOAD_TAGS";
const LOAD_TAGS_RESULTS = "root.LOAD_TAGS_RESULTS";
const UPDATE_TAG_RESULTS = "root.UPDATE_TAG_RESULTS";
const TAG_DELETED = "root.TAG_DELETED";

let initialTagsVersion = getSearchVersion(TAGS_SEARCH_VERSION_KEY);

const initialState = {
  tagHash: hashOf<ITag>(),
  loaded: false,
  version: initialTagsVersion
};

export type TagsState = typeof initialState;

export default function tagsReducer(state = initialState, action) {
  // switch (action.type) {
  //   case NEW_LOGIN:
  //     let newSearchVersion = +new Date();
  //     localStorage.setItem(TAGS_SEARCH_VERSION_KEY, "" + newSearchVersion);
  //     state = { ...state, tagsVersion: newSearchVersion };
  // }

  switch (action.type) {
    case LOAD_TAGS_RESULTS:
      return { ...state, tagHash: objectsToHash(action.tags), tagsLoaded: true };
    case UPDATE_TAG_RESULTS:
      return { ...state, tagHash: { ...state.tagHash, ...objectsToHash([action.tag]) } };
    case TAG_DELETED:
      return update(state, { tagHash: { $unset: [action._id] } });
  }

  return state;
}

const loadTags = (app: AppState) => (dispatch, state: TagsState) => {
  let publicUserId = app.publicUserId;
  let tagsVersion = state.version;

  dispatch({ type: LOAD_TAGS });

  graphqlClient.runQuery(GetTags, { publicUserId: publicUserId || void 0, cache: 5, ver: tagsVersion }).then(({ data: { allTags } }) => {
    dispatch({ type: LOAD_TAGS_RESULTS, tags: allTags.Tags });
  });
};

function createOrUpdateTag(editingTag) {
  return function(dispatch, getState) {
    let { _id, name, backgroundColor, textColor } = editingTag;
    let variables: any = { name, backgroundColor, textColor };
    if (_id) {
      variables._id = _id;
    }
    let promise: any = null;

    if (_id) {
      promise = graphqlClient.runMutation(UpdateTag, variables);
    } else {
      promise = graphqlClient.runMutation(CreateTag, variables);
    }

    promise.then(resp => {
      dispatch({ type: UPDATE_TAG_RESULTS, tag: (resp.createTag || resp.updateTag).Tag });
    });
  };
}

function deleteTag(_id) {
  return function(dispatch, getState) {
    graphqlClient.runMutation(DeleteTagMutation, { _id }).then(resp => {
      dispatch({ type: TAG_DELETED, _id });
    });
  };
}

export function useTagsState(): [TagsState, any, any] {
  let actions = { loadTags };
  return getStatePacket<TagsState>(tagsReducer, initialState, actions);
}
