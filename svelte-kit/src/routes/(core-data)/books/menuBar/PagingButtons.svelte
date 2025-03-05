<script lang="ts">
  import { page as pageStore } from "$app/stores";

  import Button from "$lib/components/ui/button/button.svelte";

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
      class="h-8 w-11 border-r-0 rounded-r-none hidden sm:flex border-neutral-300"
    >
      <span class="sr">Go to page 1</span>
      <i class="fal fa-fw fa-angle-double-left"></i>
    </Button>
    <Button variant="outline" href={pageDownHref} disabled={!canPageDown} class="h-8 w-11 sm:rounded-l-none rounded-l border-neutral-300">
      <span class="sr">Go a page down</span>
      <i class="fal fa-fw fa-angle-left"></i>
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
      class="h-8 w-11 border-r sm:border-r-0 rounded-r sm:rounded-r-none border-neutral-300"
      disabled={!canPageUp}
    >
      <span class="sr">Go a page up</span>
      <i class="fal fa-fw fa-angle-right"></i>
    </Button>
    <Button variant="outline" href={pageLastHref} class="h-8 w-11 rounded-l-none hidden sm:flex border-neutral-300" disabled={!canPageLast}>
      <span class="sr">Go to last page</span>
      <i class="fal fa-fw fa-angle-double-right"></i>
    </Button>
  </div>
</div>
