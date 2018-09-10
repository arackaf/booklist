import { USER_INFO_LOADING, USER_INFO_LOADED, SET_EDITING_INFO, USER_INFO_SAVING, USER_INFO_SAVED } from "./actionNames";

import { gqlGet } from "util/graphqlUtil";
import { graphqlClient } from "applicationRoot/rootReducerActionCreators";

import PublicUserSettingsQuery from "graphQL/settings/getPublisUserSettingsQuery.graphql";
import UpdatePublisUserSettingsMutation from "graphQL/settings/updatePublicUserSettings.graphql";

export const loadPublicUserSettings = () => dispatch => {
  dispatch({ type: USER_INFO_LOADING });

  gqlGet(PublicUserSettingsQuery).then(({ data: { getUser } }) => {
    dispatch({ type: USER_INFO_LOADED, info: getUser.User });
  });
};

const createEditingChange = (name, evtName = "value") => evt => dispatch => dispatch({ type: SET_EDITING_INFO, name, value: evt.target[evtName] });

export const editIsPublic = createEditingChange("isPublic", "checked");
export const editPublicName = createEditingChange("publicName");
export const editPublicBooksHeader = createEditingChange("publicBooksHeader");

export const savePublicInfo = () => (dispatch, getState) => {
  let editingState = getState().settingsModule.publicUserSettings.editing;
  dispatch({ type: USER_INFO_SAVING });

  graphqlClient.runMutation(UpdatePublisUserSettingsMutation, { ...editingState }).then(resp => {
    let User = resp.updateUser && resp.updateUser.User;
    User && dispatch({ type: USER_INFO_SAVED, ...User });
  });
};
