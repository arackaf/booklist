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

<div class="flex items-center gap-2">
  <div class="flex">
    <svelte:element
      this={canPageOne ? "a" : "span"}
      href={$changeFilter.pageTo(1)}
      class:disabled={!canPageOne}
      class="core-anchor-button h-8 hidden sm:flex rounded sm:rounded-tr-none sm:rounded-br-none border"
    >
      <span class="sr">Go to page 1</span>
      <i class="fal fa-fw fa-angle-double-left" />
    </svelte:element>
    <svelte:element
      this={canPageDown ? "a" : "span"}
      href={pageDownHref}
      class:disabled={!canPageDown}
      class="core-anchor-button h-8 flex rounded sm:border-l-0 sm:rounded-tl-none sm:rounded-bl-none border"
    >
      <span class="sr">Go a page down</span>
      <i class="fal fa-fw fa-angle-left" />
    </svelte:element>
  </div>

  <div class="results-holder">
    <span>
      {#if totalPages}
        <span><span class="page-label">Page </span>{page} of {totalPages}</span>
      {:else}
        <span>No results</span>
      {/if}
    </span>
  </div>

  <div class="flex">
    <svelte:element
      this={canPageUp ? "a" : "span"}
      href={pageUpHref}
      class:disabled={!canPageUp}
      class="core-anchor-button flex h-8 rounded sm:border-r-0 sm:rounded-tr-none sm:rounded-br-none border"
    >
      <span class="sr">Go a page up</span>
      <i class="fal fa-fw fa-angle-right" />
    </svelte:element>
    <svelte:element
      this={canPageLast ? "a" : "span"}
      href={pageLastHref}
      class:disabled={!canPageLast}
      class="core-anchor-button hidden sm:flex h-8 rounded sm:rounded-tl-none sm:rounded-bl-none border"
    >
      <span class="sr">Go to last page</span>
      <i class="fal fa-fw fa-angle-double-right" />
    </svelte:element>
  </div>
</div>
