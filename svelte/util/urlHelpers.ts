import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

import queryString from "query-string";

type ParsedQuery = {
  pathname: any;
  searchState: any;
};

export function getCurrentUrlState(): ParsedQuery {
  let location = history.location;
  let parsed = queryString.parse(location.search);

  if ("userId" in parsed && !parsed.userId) {
    parsed.userId = "-1"; //make it truthy so we know it's there
  }

  return {
    pathname: location.pathname,
    searchState: parsed
  };
}

export function setSearchValues(state) {
  let { pathname, searchState: existingSearchState } = getCurrentUrlState();
  let newState = { ...existingSearchState, ...state };
  newState = Object.keys(newState)
    .filter(k => newState[k])
    .reduce((hash, prop) => ((hash[prop] = newState[prop]), hash), {});

  const newSearchState = queryString.stringify(newState);

  if (location.search.replace(/^\?/, "") !== newSearchState) {
    history.push({
      pathname: history.location.pathname,
      search: newSearchState ? "?" + newSearchState : ""
    });
  }
}


export function browseTo(module) {
  var userId = getCurrentUrlState().searchState.userId;
  let currentModule = history.location.pathname.replace(/\//g, "").toLowerCase();

  if (currentModule !== module) {
    history.push({ pathname: `/${module}`, search: userId ? `?userId=${userId}` : void 0 });
  }
}