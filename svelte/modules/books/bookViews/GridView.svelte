<script lang="ts">
  import { getContext } from "svelte";
  import { Readable } from "svelte/store";
  import { quadOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  import { appState } from "app/state/appState";
  import { setBooksSort } from "modules/books/setBookFilters";

  import { currentSearch } from "../booksSearchState";
  import BookRow from "./BookRow.svelte";

  $: ({ isPublic, online } = $appState);

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState, dispatchBooksUiState } = booksModuleContext;

  $: ({ selectedBooks } = $booksUiState);

  export let booksState: Readable<{ books: any[]; currentQuery: string }>;
  $: ({ books, currentQuery } = $booksState);

  let bookSelection;
  $: {
    let selectedIdsCount = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]).length;
    bookSelection = {
      allAreChecked: books.length == selectedIdsCount,
      selectedBooksCount: selectedIdsCount,
      selectedBookHash: selectedBooks
    };
  }

  $: ({ sort, sortDirection } = $currentSearch);

  const toggleCheckAll = () => {
    dispatchBooksUiState([bookSelection.allAreChecked ? "de-select" : "select", books.map(b => b._id)]);
  };

  const setSort = column => {
    let newDirection = "asc";
    if (sort === column) {
      newDirection = sortDirection == "asc" ? "desc" : "asc";
    }

    setBooksSort(column, newDirection);
  };

  export let menuBarHeight;

  $: stickyHeaderStyle = `position: sticky; padding-top: 2px; top: ${menuBarHeight - 4}px; background-color: white; z-index: 2`;
</script>

<div class="overlay-holder">
  {#key currentQuery}
    <table transition:fade|local={{ duration: 100, easing: quadOut }} style="position: relative; align-self: start;" class="table no-padding-top">
      <thead>
        <tr>
          {#if !isPublic && online}
            <th style="{stickyHeaderStyle}; text-align: center; width: 25px;">
              <a style="font-size: 12pt" on:click={toggleCheckAll}>
                <i class={"fal " + (!!bookSelection.allAreChecked ? "fa-check-square" : "fa-square")} />
              </a>
            </th>
          {/if}
          <th style="{stickyHeaderStyle}; width: 60px" />
          <th style="{stickyHeaderStyle}; min-width: 200px">
            <a class="no-underline" on:click={() => setSort("title")}>
              Title
              {#if sort == "title"}<i class={"fa fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
            </a>
          </th>
          <th style="min-width: 90px; {stickyHeaderStyle}">Subjects</th>
          <th style="min-width: 90px; {stickyHeaderStyle}">Tags</th>
          <th style="min-width: 90px; {stickyHeaderStyle}" />
          <th style={stickyHeaderStyle} />
          <th style="min-width: 85px; {stickyHeaderStyle}">
            <a class="no-underline" on:click={() => setSort("pages")}>
              Pages
              {#if sort == "pages"}<i class={"fa fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
            </a>
          </th>
          <th style={stickyHeaderStyle}>
            <a class="no-underline" on:click={() => setSort("_id")}>
              Added
              {#if sort == "_id"}<i class={"fa fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each books as book (book._id)}
          <BookRow {book} {isPublic} {online} />
        {/each}
      </tbody>
    </table>
  {/key}
</div>
