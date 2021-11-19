import shallowEqual from "shallow-equal/objects";

import { useMemo, useReducer, useContext } from "react";
import { useTagsState } from "app/state/tagsState";

import { defaultSearchValuesHash, filtersFromUrl } from "./booksLoadingUtils";
import { useSubjectsState } from "app/state/subjectsState";
import { AppContext } from "app/state/appState";

const bookSearchInitialState = {
  hashFilters: {} as typeof defaultSearchValuesHash
};
export type BookSearchState = typeof bookSearchInitialState;

export type TagOrSubject = {
  _id: string;
  name: string;
};
export type LookupHashType = {
  [str: string]: TagOrSubject;
};

export function useBooksSearchState(): [BookSearchState] {
  let [appState] = useContext(AppContext);
  return [{ hashFilters: appState.urlState.searchState }];
}

function projectSelectedItems(ids: string = "", hash): TagOrSubject[] {
  return ids
    .split("-")
    .map(_id => (_id ? hash[_id] : null))
    .filter(res => res);
}

const keyIsFilter = k => k != "page" && k != "sort" && k != "sortDirection" && k != "userId";

export const useCurrentSearch = () => {
  const [{ hashFilters: filters }] = useBooksSearchState();
  const { subjectHash } = useSubjectsState();
  const { tagHash } = useTagsState();

  return useMemo(() => {
    let result = Object.assign({}, filtersFromUrl(filters), {
      selectedSubjects: projectSelectedItems(filters.subjects, subjectHash),
      selectedTags: projectSelectedItems(filters.tags, tagHash)
    });

    return Object.assign({}, result, {
      anyActiveFilters: !!Object.keys(filters).filter(keyIsFilter).length,
      activeFilterCount: Object.keys(filters).filter(keyIsFilter).length,
      bindableSortValue: `${result.sort}|${result.sortDirection}`
    });
  }, [filters, subjectHash, tagHash]);
};
