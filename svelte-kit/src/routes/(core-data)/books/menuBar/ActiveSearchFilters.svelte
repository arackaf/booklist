<script lang="ts">
  import colors from "tailwindcss/colors";
  import RemovableLabelDisplay from "$lib/components/subjectsAndTags/RemovableLabelDisplay.svelte";
  import { SearchState, ChangeFilters, getSortDisplay } from "../state/searchState.svelte";

  type Props = {
    totalBooks: number;
  };

  let { totalBooks }: Props = $props();

  const searchState = new SearchState();
  const changeFilter = new ChangeFilters();

  let resultsDisplay = $derived(totalBooks ? `${totalBooks} Book${totalBooks === 1 ? "" : "s"}` : "");

  const removeAllFiltersLabel = {
    textColor: "white",
    backgroundColor: colors.red[500],
    name: "Remove all filters"
  };

  const filterDisplayStyles = "flex: 0 0 auto; align-self: center; margin-right: 5px; margin-top: 4px; margin-bottom: 4px";
</script>

{#if totalBooks}
  <div style="flex: 0 0 auto; margin-right: 5px; align-self: center;">{resultsDisplay}</div>
{/if}

<div class="flex flex-wrap items-start content-center gap-1">
  {#if searchState.value.search}
    <RemovableLabelDisplay item={{ name: `"${searchState.value.search}"` }} href={changeFilter.withoutSearch} />
  {/if}
  {#if searchState.value.isRead == "true" || searchState.value.isRead == "false"}
    <RemovableLabelDisplay href={changeFilter.withoutIsRead}>
      <span>
        {#if searchState.value.isRead == "true"}Is Read <i class="far fa-check"></i>{:else}Not Read{/if}
      </span>
    </RemovableLabelDisplay>
  {/if}
  {#if searchState.value.publisher}
    <RemovableLabelDisplay item={{ name: `Publisher: "${searchState.value.publisher}"` }} href={changeFilter.withoutPublisher} />
  {/if}
  {#if searchState.value.author}
    <RemovableLabelDisplay item={{ name: `Author: "${searchState.value.author}"` }} href={changeFilter.withoutAuthor} />
  {/if}

  {#if searchState.value.noSubjects}
    <RemovableLabelDisplay item={{ name: `No subjects` }} href={changeFilter.withoutNoSubjects} />
  {/if}

  {#each searchState.value.subjectsObjects as s}
    <RemovableLabelDisplay item={s} href={changeFilter.withoutSubject(s.id)} />
  {/each}

  {#each searchState.value.tagObjects as t}
    <RemovableLabelDisplay item={t} href={changeFilter.withoutTag(t.id)} />
  {/each}

  {#if searchState.value.childSubjects}
    <RemovableLabelDisplay item={{ name: `Include child subjects` }} href={changeFilter.withoutChildSubjects} />
  {/if}

  {#if searchState.value.sort}
    <RemovableLabelDisplay item={{ name: `Sort: ${getSortDisplay(searchState.value.sortPacket)}` }} href={changeFilter.withoutSort} />
  {/if}
  {#if searchState.value.activeFilterCount > 1}
    <RemovableLabelDisplay item={removeAllFiltersLabel} href={changeFilter.withoutFilters} />
  {/if}
</div>
