import { LOAD_TAGS, LOAD_TAGS_RESULTS, UPDATE_TAG_RESULTS, LOAD_COLORS, TAG_DELETED } from "./actionNames";

import ajaxUtil from "util/ajaxUtil";

export function loadTags() {
  return function(dispatch, getState) {
    let publicUserId = getState().app.publicUserId;

    dispatch({ type: LOAD_TAGS });

    Promise.resolve(ajaxUtil.get("/tag/all", { userId: publicUserId })).then(tagsResp => {
      dispatch({ type: LOAD_TAGS_RESULTS, tags: tagsResp.results });
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
