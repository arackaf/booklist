<script lang="ts">
  import { page as pageStore } from "$app/stores";
  import Button from "$lib/components/ui/Button/Button.svelte";
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
    <Button href={$changeFilter.pageTo(1)} disabled={!canPageOne} class="h-8 connect-right hidden sm:flex" icon={true}>
      <span class="sr">Go to page 1</span>
      <i class="fal fa-fw fa-angle-double-left" />
    </Button>
    <Button href={pageDownHref} disabled={!canPageDown} class="h-8 rounded-tl sm:rounded-tl-none rounded-bl sm:rounded-bl-none" icon={true}>
      <span class="sr">Go a page down</span>
      <i class="fal fa-fw fa-angle-left" />
    </Button>
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
    <Button
      href={pageUpHref}
      class="h-8 border-r sm:border-r-0 rounded-tr sm:rounded-tr-none rounded-br sm:rounded-br-none"
      icon={true}
      disabled={!canPageUp}
    >
      <span class="sr">Go a page up</span>
      <i class="fal fa-fw fa-angle-right" />
    </Button>
    <Button href={pageLastHref} class="h-8 connect-left hidden sm:flex" icon={true} disabled={!canPageLast}>
      <span class="sr">Go to last page</span>
      <i class="fal fa-fw fa-angle-double-right" />
    </Button>
  </div>
</div>
