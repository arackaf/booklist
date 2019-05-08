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

const currentSearchStateFromHistory = () => {
  let { searchState } = getCurrentHistoryState();
  return { search: searchState.search || void 0 };
};

export default () => {
  const result = writable(currentSearchStateFromHistory());
  history.listen(() => {
    result.set(currentSearchStateFromHistory());
  });
  return result;
};
