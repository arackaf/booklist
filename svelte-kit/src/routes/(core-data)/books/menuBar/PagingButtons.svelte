<script lang="ts">
  import { page as pageStore } from "$app/stores";
  import { changeFilter } from "../state/searchState";

  $: ({ page, totalPages } = $pageStore.data);

  $: canPageUp = page < totalPages;
  $: canPageDown = page > 1;
  $: canPageOne = page > 1;
  $: canPageLast = page < totalPages;

  $: pageDownHref = $changeFilter.pageTo(page - 1, totalPages);
  $: pageUpHref = $changeFilter.pageTo(page + 1, totalPages);
  $: pageLastHref = $changeFilter.pageTo(totalPages, totalPages);
</script>

<div style="display: flex; margin-right: 5px; align-items: center">
  <div class="btn-group">
    <svelte:element this={canPageOne ? "a" : "span"} href={$changeFilter.pageTo(1)} class:disabled={!canPageOne} class="btn btn-default page-edge">
      <span class="sr">Go to page 1</span>
      <i class="fal fa-fw fa-angle-double-left" />
    </svelte:element>
    <svelte:element
      this={canPageDown ? "a" : "span"}
      href={pageDownHref}
      class:disabled={!canPageDown}
      class="btn btn-default page"
      style="margin-right: 5px"
    >
      <span class="sr">Go a page down</span>
      <i class="fal fa-fw fa-angle-left" />
    </svelte:element>
  </div>

  <div class="results-holder overlay-holder">
    <span style="display: inline;">
      {#if totalPages}
        <span><span class="page-label">Page </span>{page} of {totalPages}</span>
      {:else}
        <span>No results</span>
      {/if}
    </span>
    <span style="visibility: hidden">
      <span class="page-label">Page </span>1 of 10
    </span>
  </div>

  <div class="btn-group">
    <svelte:element
      this={canPageUp ? "a" : "span"}
      href={pageUpHref}
      class:disabled={!canPageUp}
      class="btn btn-default page"
      style="margin-left: 5px"
    >
      <span class="sr">Go a page up</span>
      <i class="fal fa-fw fa-angle-right" />
    </svelte:element>
    <svelte:element this={canPageLast ? "a" : "span"} href={pageLastHref} class:disabled={!canPageLast} class="btn btn-default page-edge">
      <span class="sr">Go to last page</span>
      <i class="fal fa-fw fa-angle-double-right" />
    </svelte:element>
  </div>
</div>

<style>
  .btn {
    padding: 6px;
  }
</style>
