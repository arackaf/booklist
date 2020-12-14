import { derived } from "svelte/store";

import shallowEqual from "shallow-equal/objects";
import { tagsState } from "app/state/tagsState";

import { defaultSearchValuesHash, filtersFromUrl, BookSearchFiltersType } from "./booksLoadingUtils";
import { subjectsState } from "app/state/subjectsState";
import { appState } from "app/state/appState";

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

export const booksSearchState = derived(appState, ({ urlState }) => ({ hashFilters: urlState.searchState }));

function projectSelectedItems(ids: string = "", hash): TagOrSubject[] {
  return ids
    .split("-")
    .map(_id => (_id ? hash[_id] : null))
    .filter(res => res);
}

const keyIsFilter = k => k != "page" && k != "sort" && k != "sortDirection" && k != "userId";

type CurrentSearchType = BookSearchFiltersType & { anyActiveFilters: boolean; activeFilterCount: number; bindableSortValue: string };
export const currentSearch = derived([booksSearchState, subjectsState, tagsState], ([$books, $subjects, $tags]) => {
  const filters = $books.hashFilters;

  const result = Object.assign({}, filtersFromUrl(filters), {
    selectedSubjects: projectSelectedItems(filters.subjects, $subjects.subjectHash),
    selectedTags: projectSelectedItems(filters.tags, $tags.tagHash)
  });

  return Object.assign({}, result, {
    anyActiveFilters: !!Object.keys(filters).filter(keyIsFilter).length,
    activeFilterCount: Object.keys(filters).filter(keyIsFilter).length,
    bindableSortValue: `${result.sort}|${result.sortDirection}`
  }) as CurrentSearchType;
});
