import shallowEqual from "shallow-equal/objects";

import { getCurrentHistoryState, history } from "reactStartup";
import { useMemo, useEffect, useReducer } from "react";
import { useTagsState } from "app/tagsState";

import { defaultSearchValuesHash, filtersFromUrl } from "./booksLoadingUtils";
import { useSubjectsState } from "app/subjectsState";

const bookSearchInitialState = {
  hashFilters: {} as typeof defaultSearchValuesHash
};
export type BookSearchState = typeof bookSearchInitialState;

export function bookSearchReducer(state = bookSearchInitialState, action): BookSearchState {
  switch (action.type) {
    case "HASH_CHANGED":
      let { filters } = action;
      if (!shallowEqual(filters, state.hashFilters)) {
        return { ...state, hashFilters: filters };
      }
      return { ...state };
  }
  return state;
}

export type TagOrSubject = {
  _id: string;
  name: string;
};
export type LookupHashType = {
  [str: string]: TagOrSubject;
};

export function useBooksSearchState(): [BookSearchState, any] {
  let initialSearchState = useMemo(() => ({ ...bookSearchInitialState, hashFilters: getCurrentHistoryState().searchState }), []);
  let [result, dispatch] = useReducer(bookSearchReducer, initialSearchState);

  useEffect(() => {
    return history.listen(() => {
      const { searchState } = getCurrentHistoryState();
      dispatch({ type: "HASH_CHANGED", filters: searchState });
    });
  }, [dispatch]);

  return [result, dispatch];
}

export const useSelectedSubjects = () => {
  const [{ hashFilters }] = useBooksSearchState();
  const { subjects } = hashFilters;
  const { subjectHash } = useSubjectsState();

  return useMemo(() => projectSelectedItems(subjects, subjectHash), [subjects, subjectHash]);
};

export const useSelectedTags = () => {
  const [{ hashFilters }] = useBooksSearchState();
  const { tags } = hashFilters;
  const { tagHash } = useTagsState();

  return useMemo(() => projectSelectedItems(tags, tagHash), [tags, tagHash]);
};

function projectSelectedItems(ids: string = "", hash): TagOrSubject[] {
  return ids
    .split("-")
    .map(_id => (_id ? hash[_id] : null))
    .filter(res => res);
}

const keyIsFilter = k => k != "page" && k != "sort" && k != "sortDirection" && k != "userId";

export const useCurrentSearch = () => {
  const [{ hashFilters: filters }] = useBooksSearchState();
  const { subjects: subjectsHashValue, tags: tagsHashValue } = filters;

  const subjects = useSelectedSubjects();
  const tags = useSelectedTags();

  return useMemo(() => {
    let result = Object.assign({}, filtersFromUrl(filters), {
      selectedSubjects: subjects,
      selectedTags: tags
    });

    return Object.assign({}, result, {
      anyActiveFilters: !!Object.keys(filters).filter(keyIsFilter).length,
      activeFilterCount: Object.keys(filters).filter(keyIsFilter).length,
      bindableSortValue: `${result.sort}|${result.sortDirection}`
    });
  }, [filters, subjects, tags, subjectsHashValue, tagsHashValue]);
};
