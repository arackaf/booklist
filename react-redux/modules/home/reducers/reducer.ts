import { combineReducers } from "redux";
import { recommendReducer as recommend } from "./recommend/reducer";
import { searchReducer as search, SearchReducerType } from "./search/reducer";
import { AppType } from "applicationRoot/rootReducer";

export type HomeType = {
  app: AppType;
  homeModule: {
    search: SearchReducerType;
  };
};

export const reducer = combineReducers({
  recommend,
  search
});
