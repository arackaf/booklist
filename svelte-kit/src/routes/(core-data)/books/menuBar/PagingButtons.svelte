<script lang="ts">
  import { page as pageStore } from "$app/stores";
  import Button from "$lib/components/Button/Button.svelte";
  import { changeFilter } from "../state/searchState";

  let { page, totalPages } = $derived($pageStore.data);

  let canPageUp = $derived(page < totalPages);
  let canPageDown = $derived(page > 1);
  let canPageOne = $derived(page > 1);
  let canPageLast = $derived(page < totalPages);

  let pageDownHref = $derived($changeFilter.pageTo(page - 1, totalPages));
  let pageUpHref = $derived($changeFilter.pageTo(page + 1, totalPages));
  let pageLastHref = $derived($changeFilter.pageTo(totalPages, totalPages));
</script>

<div class="flex items-center gap-2">
  <div class="flex">
    <Button href={$changeFilter.pageTo(1)} disabled={!canPageOne} class="h-8 connect-right hidden sm:flex" icon={true}>
      <span class="sr">Go to page 1</span>
      <i class="fal fa-fw fa-angle-double-left"></i>
    </Button>
    <Button href={pageDownHref} disabled={!canPageDown} class="h-8 rounded-tl sm:rounded-tl-none rounded-bl sm:rounded-bl-none" icon={true}>
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
      href={pageUpHref}
      class="h-8 border-r sm:border-r-0 rounded-tr sm:rounded-tr-none rounded-br sm:rounded-br-none"
      icon={true}
      disabled={!canPageUp}
    >
      <span class="sr">Go a page up</span>
      <i class="fal fa-fw fa-angle-right"></i>
    </Button>
    <Button href={pageLastHref} class="h-8 connect-left hidden sm:flex" icon={true} disabled={!canPageLast}>
      <span class="sr">Go to last page</span>
      <i class="fal fa-fw fa-angle-double-right"></i>
    </Button>
  </div>
</div>
