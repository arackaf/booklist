import { LOAD_RECOMMENDATIONS, LOAD_RECOMMENDATIONS_COMPLETE } from "./actionNames";
import ajaxUtil from "util/ajaxUtil";
import { selectSelectedBookIds } from "./reducer";

export const findRecommendations = () => (dispatch, getState) => {
  dispatch({ type: LOAD_RECOMMENDATIONS });
  let bookIds = selectSelectedBookIds(getState());
  ajaxUtil.post("/book/getRecommendations", { bookIds }).then(resp => {
    dispatch({ type: LOAD_RECOMMENDATIONS_COMPLETE, searchResults: resp.results });
  });
};
