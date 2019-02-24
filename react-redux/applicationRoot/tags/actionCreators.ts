import { LOAD_TAGS, LOAD_TAGS_RESULTS, UPDATE_TAG_RESULTS, LOAD_COLORS, TAG_DELETED } from "../rootReducerActionNames";

import { graphqlClient } from "applicationRoot/rootReducerActionCreators";

import GetTags from "graphQL/tags/getTags.graphql";
import UpdateTag from "graphQL/tags/updateTag.graphql";
import CreateTag from "graphQL/tags/createTag.graphql";
import DeleteTagMutation from "graphQL/tags/deleteTag.graphql";

export function loadTags() {
  return function(dispatch, getState) {
    let app: any = getState().app;
    let publicUserId = app.publicUserId;

    dispatch({ type: LOAD_TAGS });

    graphqlClient.runQuery(GetTags, { publicUserId: publicUserId || void 0, cache: 5 }).then(({ data: { allTags } }) => {
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
      promise = graphqlClient.runMutation(UpdateTag, variables);
    } else {
      promise = graphqlClient.runMutation(CreateTag, variables);
    }

    promise.then(resp => {
      dispatch({ type: UPDATE_TAG_RESULTS, tag: (resp.createTag || resp.updateTag).Tag });
    });
  };
}

export function deleteTag(_id) {
  return function(dispatch, getState) {
    graphqlClient.runMutation(DeleteTagMutation, { _id }).then(resp => {
      dispatch({ type: TAG_DELETED, _id });
    });
  };
}
