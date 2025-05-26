<script lang="ts">
  import { page as pageStore } from "$app/stores";

  import Button from "$lib/components/ui/button/button.svelte";
  import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte";

  import { ChangeFilters } from "../state/searchState.svelte";

  let { page, totalPages } = $derived($pageStore.data);

  const changeFilter = new ChangeFilters();

  let canPageUp = $derived(page < totalPages);
  let canPageDown = $derived(page > 1);
  let canPageOne = $derived(page > 1);
  let canPageLast = $derived(page < totalPages);

  let pageDownHref = $derived(changeFilter.pageTo(page - 1, totalPages));
  let pageUpHref = $derived(changeFilter.pageTo(page + 1, totalPages));
  let pageLastHref = $derived(changeFilter.pageTo(totalPages, totalPages));
</script>

<div class="flex items-center gap-2">
  <div class="flex">
    <Button
      variant="outline"
      href={changeFilter.pageTo(1)}
      disabled={!canPageOne}
      class="h-8 w-10 border-r-0 rounded-r-none hidden sm:flex"
      aria-label="Go to page 1"
    >
      <ChevronFirstIcon />
    </Button>
    <Button variant="outline" href={pageDownHref} disabled={!canPageDown} class="h-8 w-10 sm:rounded-l-none rounded-l" aria-label="Go a page down">
      <ChevronLeftIcon />
    </Button>
  </div>

  <div class="results-holder">
    <span>
      {#if totalPages}
        <span><span class="page-label">Page</span> {page} of {totalPages}</span>
      {:else}
        <span>No results</span>
      {/if}
    </span>
  </div>

  <div class="flex">
    <Button
      variant="outline"
      href={pageUpHref}
      class="h-8 w-10 border-r sm:border-r-0 rounded-r sm:rounded-r-none"
      disabled={!canPageUp}
      aria-label="Go a page up"
    >
      <ChevronRightIcon />
    </Button>
    <Button variant="outline" href={pageLastHref} class="h-8 w-10 rounded-l-none hidden sm:flex" disabled={!canPageLast} aria-label="Go to last page">
      <ChevronLastIcon />
    </Button>
  </div>
</div>
