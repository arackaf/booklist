import { getCurrentUrlState } from "util/urlHelpers";
import { computeBookSearchVariables, filtersFromUrl } from "./bookFiltersToGraphqlArgs";

export function bookSearchVariablesFromCurrentUrl() {
  return computeBookSearchVariables(filtersFromUrl(getCurrentUrlState().searchState));
}
