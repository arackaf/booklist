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
    let { _id, name, backgroundColor, textColor } = editingTag,
      request = { _id: _id || null, name, backgroundColor, textColor };

    return ajaxUtil.post("/tag/setInfo", request, resp => dispatch({ type: UPDATE_TAG_RESULTS, tag: resp.tag }));
  };
}

export function deleteTag(_id) {
  return function(dispatch, getState) {
    return ajaxUtil.post("/tag/delete", { _id: _id + "" }, resp => {
      dispatch({ type: TAG_DELETED, _id });
    });
  };
}
