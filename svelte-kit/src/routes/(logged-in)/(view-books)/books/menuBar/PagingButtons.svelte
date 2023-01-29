<script lang="ts">
  import { page as pageStore } from "$app/stores";
  import { changeFilter } from "../state/searchState";

  $: ({ page, totalPages } = $pageStore.data);

  $: canPageUp = page < totalPages;
  $: canPageDown = page > 1;
  $: canPageOne = page > 1;
  $: canPageLast = page < totalPages;
</script>

<div style="display: flex; margin-right: 5px; align-items: center">
  <div class="btn-group">
    <a href={$changeFilter.pageTo(1)} class:disabled={!canPageOne} class="btn btn-default page-edge"><i class="fal fa-angle-double-left" /></a>
    <a href={$changeFilter.pageTo(page - 1, totalPages)} class:disabled={!canPageDown} class="btn btn-default page" style="margin-right: 5px">
      <i class="fal fa-angle-left" />
    </a>
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
    <a href={$changeFilter.pageTo(page + 1, totalPages)} class:disabled={!canPageUp} class="btn btn-default page" style="margin-left: 5px">
      <i class="fal fa-angle-right" />
    </a>
    <a href={$changeFilter.pageTo(totalPages, totalPages)} class:disabled={!canPageLast} class="btn btn-default page-edge">
      <i class="fal fa-angle-double-right" />
    </a>
  </div>
</div>
