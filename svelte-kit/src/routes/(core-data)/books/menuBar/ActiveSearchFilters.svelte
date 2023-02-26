<script lang="ts">
  import { page } from "$app/stores";

  import RemovableLabelDisplay from "$lib/components/subjectsAndTags/RemovableLabelDisplay.svelte";
  import { searchState, changeFilter, getSortDisplay } from "../state/searchState";

  $: ({ totalBooks } = $page.data);
  $: resultsCount = $totalBooks;

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
  {#if $searchState.isRead == "true" || $searchState.isRead == "false"}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} href={$changeFilter.withoutIsRead}>
      <span>
        {#if $searchState.isRead == "true"}Is Read <i class="far fa-check" />{:else}Not Read{/if}
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

  {#if $searchState.noSubjects}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={{ name: `No subjects` }} href={$changeFilter.withoutNoSubjects} />
  {/if}

  {#each $searchState.subjectsObjects as s}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={s} href={$changeFilter.withoutSubject(s.id)} />
  {/each}
  {#each $searchState.tagObjects as t}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={t} href={$changeFilter.withoutTag(t.id)} />
  {/each}
  {#if $searchState.sort}
    <RemovableLabelDisplay
      extraStyles={filterDisplayStyles}
      item={{ name: `Sort: ${getSortDisplay($searchState.sortPacket)}` }}
      href={$changeFilter.withoutSort}
    />
  {/if}
  {#if $searchState.activeFilterCount > 1}
    <RemovableLabelDisplay extraStyles={filterDisplayStyles} item={removeAllFiltersLabel} href={$changeFilter.withoutFilters} />
  {/if}
</div>
