<script lang="ts">
  import { page as pageStore } from "$app/stores";
  import { BOOKS_PAGE_SIZE } from "$lib/state/dataConstants";
  import { changeFilter, searchState } from "../state/searchState";

  //import { appState } from "app/state/appState";
  //import { currentSearch } from "../booksSearchState";
  //import { pageOne, setPage } from "../setBookFilters";

  $: ({ page } = $searchState);
  $: ({ totalBooks } = $pageStore.data);
  $: resultsCount = $totalBooks;

  $: totalPages = Math.ceil(resultsCount / BOOKS_PAGE_SIZE);

  //let totalPages: number = 1;
  //let resultsCount: number = 50;

  //const page = 1;

  const setPage = (page: number) => {};
  const pageOne = () => {};

  //$: ({ page, pageSize } = $currentSearch);

  $: canPageUp = page < totalPages;
  $: canPageDown = page > 1;
  $: canPageOne = page > 1;
  $: canPageLast = page < totalPages;

  let pageUp = () => setPage(+page + 1);
  let pageDown = () => setPage(+page - 1);
  let pageLast = () => setPage(totalPages);
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
