import { combineReducers } from "redux";
import { recommendReducer as recommend } from "./recommend/reducer";
import { searchReducer as search } from "./search/reducer";

export const reducer = combineReducers({
  recommend,
  search
});
