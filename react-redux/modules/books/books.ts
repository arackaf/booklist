import BookViewList from "./components/bookViewList";
import { reducer } from "./reducers/reducer";
import { syncFiltersToHash } from "./reducers/bookSearch/actionCreators";
import { booksInitialized } from "./reducers/bookSearch/actionCreators";
import { store } from "applicationRoot/store";

export default {
  reducer: reducer,
  component: BookViewList,
  initialize: booksInitialized
};
