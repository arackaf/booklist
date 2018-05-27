import { LOAD_TAGS, LOAD_TAGS_RESULTS, UPDATE_TAG_RESULTS, LOAD_COLORS, TAG_DELETED } from "./actionNames";

import ajaxUtil from "util/ajaxUtil";
import { compress } from "micro-graphql-react";
import { graphqlClient } from "applicationRoot/rootReducerActionCreators";

import getTags from "./getTags.graphql";
import updateTag from "./updateTag.graphql";
import createTag from "./createTag.graphql";
import deleteTagMutation from "./deleteTag.graphql";

export function loadTags() {
  return function(dispatch, getState) {
    let publicUserId = getState().app.publicUserId;

    dispatch({ type: LOAD_TAGS });

    graphqlClient.runQuery(getTags, { publicUserId: publicUserId || void 0 }).then(({ data: { allTags } }) => {
      dispatch({ type: LOAD_TAGS_RESULTS, tags: allTags.Tags });
    });
  };
}

export function createOrUpdateTag(editingTag) {
  return function(dispatch, getState) {
    let { _id, name, backgroundColor, textColor } = editingTag;
    let variables: any = { name, backgroundColor, textColor };
    if (_id) {
      variables._id = _id;
    }
    let promise: any = null;

    if (_id) {
      promise = graphqlClient.runMutation(updateTag, variables);
    } else {
      promise = graphqlClient.runMutation(createTag, variables);
    }

    promise.then(resp => {
      dispatch({ type: UPDATE_TAG_RESULTS, tag: (resp.createTag || resp.updateTag).Tag });
    });
  };
}

export function deleteTag(_id) {
  return function(dispatch, getState) {
    graphqlClient.runMutation(deleteTagMutation, { _id }).then(resp => {
      dispatch({ type: TAG_DELETED, _id });
    });
  };
}
