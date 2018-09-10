import { combineReducers } from "redux";
import { recommendReducer as recommend } from "./recommend/reducer";
import { searchReducer as search, SearchReducerType } from "./search/reducer";
import { RecommendReducerType } from "./recommend/reducer";
import { AppType } from "applicationRoot/rootReducer";

export interface ISearchBookRaw {
  _id: string;
  isRead: boolean;
  isbn: string;
  smallImage: string;
  authors: string[];
  subjects: string[];
  tags: string[];
  title: string;
}

export type HomeType = {
  app: AppType;
  homeModule: {
    search: SearchReducerType;
    recommend: RecommendReducerType;
  };
};

export const reducer = combineReducers({
  recommend,
  search
});
