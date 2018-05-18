import { LOAD_TAGS, LOAD_TAGS_RESULTS, UPDATE_TAG_RESULTS, LOAD_COLORS, TAG_DELETED } from "./actionNames";

import ajaxUtil from "util/ajaxUtil";
import { compress } from "micro-graphql-react";
import { graphqlClient } from "applicationRoot/rootReducerActionCreators";

export function loadTags() {
  return function(dispatch, getState) {
    let publicUserId = getState().app.publicUserId;

    dispatch({ type: LOAD_TAGS });

    graphqlClient
      .runQuery(
        compress`query allTags {
          allTags(publicUserId: ${JSON.stringify(publicUserId)}, SORT: {name: 1}) {
            Tags {
              _id, name, backgroundColor, textColor, path,  
            }
          }
        }`
      )
      .then(({ data: { allTags } }) => {
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
      promise = graphqlClient.runMutation(
        `mutation updateTag($_id: String, $name: String, $backgroundColor: String, $textColor: String) {
            updateTag(_id: $_id, Updates: { name: $name, backgroundColor: $backgroundColor, textColor: $textColor }) {
              Tag{
                _id, name, backgroundColor, textColor
              }
            }
          }`,
        variables
      );
    } else {
      promise = graphqlClient.runMutation(
        `mutation createTag($name: String, $backgroundColor: String, $textColor: String) {
          createTag(Tag: { name: $name, backgroundColor: $backgroundColor, textColor: $textColor }) {
            Tag{
              _id, name, backgroundColor, textColor
            }
          }
        }`,
        variables
      );
    }

    promise.then(resp => {
      dispatch({ type: UPDATE_TAG_RESULTS, tag: (resp.createTag || resp.updateTag).Tag });
    });
  };
}

export function deleteTag(_id) {
  return function(dispatch, getState) {
    graphqlClient
      .runMutation(
        `mutation deleteTag($_id: String) {
          deleteTag(_id: $_id)
        }`,
        { _id }
      )
      .then(resp => {
        dispatch({ type: TAG_DELETED, _id });
      });
  };
}
