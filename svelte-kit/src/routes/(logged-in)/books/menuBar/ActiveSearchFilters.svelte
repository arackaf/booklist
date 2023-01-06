<script lang="ts">
  import { writable } from "svelte/store";

  // import { appState } from 'app/state/appState';
  // import { currentSearch } from '../booksSearchState';
  import RemovableLabelDisplay from "$lib/components/subjectsAndTags/RemovableLabelDisplay.svelte";
  import { searchState, changeFilter } from "../searchState";

  const currentSearch = writable({ selectedSubjects: [], selectedTags: [] } as any);
  //import { clearAllFilters, removeFilters, removeFilterSubject, removeFilterTag } from '../setBookFilters';
  const clearAllFilters = (...args: any[]) => {};
  const removeFilters = (...args: any[]) => {};
  const removeFilterSubject = (...args: any[]) => {};
  const removeFilterTag = (...args: any[]) => {};

  export let resultsCount: string | number;

  $: resultsDisplay = resultsCount ? `${resultsCount} Book${resultsCount === 1 ? "" : "s"}` : "";
  const removeAllFiltersLabel = {
    backgroundColor: "var(--danger-7)",
    name: "Remove all filters"
  };

  const filterDisplayStyles = "flex: 0 0 auto; align-self: center; margin-right: 5px; margin-top: 4px; margin-bottom: 4px";
</script>

{#if resultsCount}
  <div style="flex: 0 0 auto; margin-right: 5px; align-self: center;">{resultsDisplay}</div>
{/if}

<div style="display: flex; align-items: flex-start; align-content: center; flex-wrap: wrap">
  {#if $searchState.search}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={{ name: `"${$searchState.search}"` }} href={$changeFilter.withoutSearch} />
  {/if}
  {#if $currentSearch.isRead == "1" || $currentSearch.isRead == "0"}
    <RemovableLabelDisplay
      extraStyles="flex: 0 0 auto; align-self: center; margin-right: 5px; margin-top: 4px; margin-bottom: 4px"
      doRemove={() => removeFilters("isRead")}
    >
      <span>
        {#if $currentSearch.isRead == "1"}Is Read{:else}Not Read{/if}
        &nbsp;
        {#if $currentSearch.isRead == "1"}<i class="far fa-check" />{/if}
      </span>
    </RemovableLabelDisplay>
  {/if}
  {#if $searchState.publisher}
    <RemovableLabelDisplay
      extraStyles={filterDisplayStyles}
      item={{ name: `Publisher: "${$searchState.publisher}"` }}
      href={$changeFilter.withoutPublisher}
    />
  {/if}
  {#if $searchState.author}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={{ name: `Author: "${$searchState.author}"` }} href={$changeFilter.withoutAuthor} />
  {/if}

  {#if $currentSearch.noSubjects}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={{ name: `No subjects` }} doRemove={() => removeFilters("noSubjects")} />
  {/if}

  {#each $currentSearch.selectedSubjects as s}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={s} doRemove={() => removeFilterSubject(s._id)} />
  {/each}
  {#each $currentSearch.selectedTags as t}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={t} doRemove={() => removeFilterTag(t._id)} />
  {/each}
  {#if $currentSearch.activeFilterCount > 1}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={removeAllFiltersLabel} doRemove={clearAllFilters} />
  {/if}
</div>
