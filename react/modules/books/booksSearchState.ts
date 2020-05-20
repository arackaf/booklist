import shallowEqual from "shallow-equal/objects";

import { useMemo, useReducer, useContext } from "react";
import { useTagsState } from "app/state/tagsState";

import { defaultSearchValuesHash, filtersFromUrl, bookQueryVariables } from "./booksLoadingUtils";
import { useSubjectsState } from "app/state/subjectsState";
import { AppContext } from "app/renderUI";
import { graphqlClient } from "util/graphql";

const bookSearchInitialState = {
  hashFilters: {} as typeof defaultSearchValuesHash,
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
  const currentSearchState = appState.urlState.searchState;

  let [result, dispatch] = useReducer((_, { hashFilters }) => ({ hashFilters }), {
    hashFilters: appState.urlState.searchState
  });

  if (appState.urlState.searchState != result.hashFilters && (appState.module == "books" || appState.module == "view")) {
    dispatch({ hashFilters: appState.urlState.searchState });
  }

  //uncommenting this line creates weird behavior: a parent component and its child get out of sync. I can log a parent's props being *different* than
  //the child it immediately renders (and the final state is visually incorrect). But how could it? It's literally the same return value either way, isn't it?
  //how could laundering appState.urlState.searchState through a reducer function possibly make any difference?

  //return [{ hashFilters: appState.urlState.searchState }];
  return [result];
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
      bindableSortValue: `${result.sort}|${result.sortDirection}`,
    });
  }, [filters, subjectHash, tagHash]);
};
