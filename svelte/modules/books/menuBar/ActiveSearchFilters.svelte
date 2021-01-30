<script lang="ts">
  import cn from "classnames";

  import { appState } from "app/state/appState";
  import { currentSearch } from "../booksSearchState";
  import RemovableLabelDisplay from "app/components/subjectsAndTags/RemovableLabelDisplay.svelte";
  import { clearAllFilters, removeFilters, removeFilterSubject, removeFilterTag } from "../setBookFilters";

  export let resultsCount: string | number;

  $: ({ online } = $appState);

  $: resultsDisplay = resultsCount ? `${resultsCount} Book${resultsCount === 1 ? "" : "s"}` : "";
  const removeAllFiltersLabel = {
    backgroundColor: "var(--danger-7)",
    name: "Remove all filters"
  };

  const filterDisplayStyles = "flex: 0 0 auto; align-self: center; margin-right: 5px; margin-top: 4px; margin-bottom: 4px";
</script>

{#if online && resultsCount}
  <div style="flex: 0 0 auto; margin-right: 5px; align-self: center;">{resultsDisplay}</div>
{/if}

<div style="display: flex; align-items: flex-start; align-content: center; flex-wrap: wrap">
  {#if $currentSearch.search}
    <RemovableLabelDisplay
      extraStyles="flex: 0 0 auto; align-self: center; margin-right: 5px; margin-top: 4px; margin-bottom: 4px"
      item={{ name: `"${$currentSearch.search}"` }}
      doRemove={() => removeFilters('search')}
    />
  {/if}
  {#if $currentSearch.isRead == '1' || $currentSearch.isRead == '0'}
    <RemovableLabelDisplay
      extraStyles="flex: 0 0 auto; align-self: center; margin-right: 5px; margin-top: 4px; margin-bottom: 4px"
      doRemove={() => removeFilters('isRead')}
    >
      <span>
        {#if $currentSearch.isRead == '1'}Is Read{:else}Not Read{/if}
        &nbsp;
        {#if $currentSearch.isRead == '1'}<i class="far fa-check" />{/if}
      </span>
    </RemovableLabelDisplay>
  {/if}
  {#if $currentSearch.publisher}
    <RemovableLabelDisplay
      extraStyles={filterDisplayStyles}
      item={{ name: `Publisher: "${$currentSearch.publisher}"` }}
      doRemove={() => removeFilters('publisher')}
    />
  {/if}
  {#if $currentSearch.author}
    <RemovableLabelDisplay
      extraStyles={filterDisplayStyles}
      item={{ name: `Author: "${$currentSearch.author}"` }}
      doRemove={() => removeFilters('author')}
    />
  {/if}
  {#if $currentSearch.pages || $currentSearch.pages == '0'}
    <RemovableLabelDisplay
      extraStyles={filterDisplayStyles}
      item={{ name: `Pages: ${$currentSearch.pagesOperator == 'lt' ? '<' : '>'} ${$currentSearch.pages}` }}
      doRemove={() => removeFilters('pages', 'pagesOperator')}
    />
  {/if}
  {#if $currentSearch.noSubjects}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={{ name: `No subjects` }} doRemove={() => removeFilters('noSubjects')} />
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
