import { loadPublicUserSettings } from "./publicUserSettings/actionCreators";
import { combineReducers } from "redux";
import publicUserSettings, { selector as publicUserSettingsSelector } from "./publicUserSettings/reducer";

export default combineReducers({
  publicUserSettings
});

export const selector = state => state;

export function initialize() {
  return (dispatch, getState) => {
    dispatch(loadPublicUserSettings());
  };
}
