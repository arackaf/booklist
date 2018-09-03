import BookViewList from "./components/bookViewList";
import { reducer } from "./reducers/reducer";
import { booksInitialized } from "./reducers/bookSearch/actionCreators";

export default {
  reducer: reducer,
  component: BookViewList,
  initialize: booksInitialized
};
