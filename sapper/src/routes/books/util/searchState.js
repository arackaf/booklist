import { writable } from "svelte/store";
import history from "../../../util/history";

import queryString from "query-string";

export function getCurrentHistoryState() {
  let location = history.location;
  return {
    pathname: location.pathname,
    searchState: queryString.parse(location.search)
  };
}

export default () => {
  const result = writable(getCurrentHistoryState());
  history.listen(() => {
    result.set(getCurrentHistoryState());
  });
  return result;
};
