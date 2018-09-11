import { LOAD_RECOMMENDATIONS } from "./actionNames";
import ajaxUtil from "util/ajaxUtil";
import { selectSelectedBookIds } from "./reducer";

export const findRecommendations = () => (dispatch, getState) => {
  dispatch({ type: LOAD_RECOMMENDATIONS });
  let bookIds = selectSelectedBookIds(getState());
  ajaxUtil.post("/book/getRecommendations", { bookIds }).then(resp => {
    debugger;
  });
};
