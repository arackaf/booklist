import { combineReducers } from "redux";
import { recommendReducer as recommend } from "./recommend/reducer";

export const reducer = combineReducers({
  recommend
});
