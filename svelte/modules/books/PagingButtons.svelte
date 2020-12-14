<script lang="ts">
  import { appState } from "app/state/appState";
  import { currentSearch } from "./booksSearchState";
  import { pageOne, setPage } from "./setBookFilters";

  export let selectedBooksCount: number;
  export let totalPages: number;
  export let resultsCount: number;

  $: ({ online } = $appState);

  $: ({ page, pageSize } = $currentSearch);

  $: canPageUp = online ? page < totalPages : resultsCount == pageSize;
  $: canPageDown = page > 1;
  $: canPageOne = page > 1;
  $: canPageLast = page < totalPages;

  let pageUp = () => setPage(+page + 1);
  let pageDown = () => setPage(+page - 1);
  let pageLast = () => setPage(totalPages);
</script>

{#if !selectedBooksCount}
  <div class="visible-xs" style="margin-right: 5px">
    <div>
      <button onClick={pageDown} disabled={!canPageDown} class="btn btn-default btn-group-size"><i class="fal fa-angle-left" /></button>
      <span style="padding-left: 3px; padding-right: 3px"> {page} of {totalPages} </span>
      <button onClick={pageUp} disabled={!canPageUp} class="btn btn-default btn-group-size"><i class="fal fa-angle-right" /></button>
    </div>
  </div>
{/if}
<div class="hidden-xs" style="display: flex; margin-right: 5px; align-items: center">
  <div class="btn-group">
    <button onClick={pageOne} disabled={!canPageOne} class="btn btn-default"><i class="fal fa-angle-double-left" /></button>
    <button onClick={pageDown} disabled={!canPageDown} class="btn btn-default" style="margin-right: 5px">
      <i class="fal fa-angle-left" />
    </button>
  </div>
  {#if online}
    <span style="display: inline; min-width: 7ch">
      {#if resultsCount}<span> Page {page} of {totalPages} </span>{:else}<span>Loading...</span>{/if}
    </span>
  {/if}
  <div class="btn-group">
    <button onClick={pageUp} disabled={!canPageUp} class="btn btn-default" style="margin-left: 5px">
      <i class="fal fa-angle-right" />
    </button>

    {#if online}
      <button onClick={pageLast} disabled={!canPageLast} class="btn btn-default"><i class="fal fa-angle-double-right" /></button>
    {/if}
  </div>
</div>
