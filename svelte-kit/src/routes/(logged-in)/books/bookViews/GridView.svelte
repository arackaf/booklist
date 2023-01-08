<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";
  import BookRow from "./BookRow.svelte";
  import { changeFilter, searchState } from "../state/searchState";
  import { selectedBooks, selectionState } from "../state/selectionState";

  const isPublic = false;

  export let books: Book[];
  export let subjects: Subject[];
  export let tags: Tag[];
  const noop = () => {};

  $: ({ sortField, sortDirection } = $searchState);

  $: allBooksSelected = books.length === $selectedBooks.length;
  function toggleCheckAll() {
    if (allBooksSelected) {
      selectionState.clear();
    } else {
      selectionState.selectAll(books);
    }
  }

  const setSort = (field: string) => {
    let direction = "asc";
    if (field === sortField && sortDirection === "desc") {
      direction = "desc";
    }
    $changeFilter.withSort(`${field}-${direction}`);
  };
</script>

<table style="position: relative; align-self: start;" class="table no-padding-top">
  <thead>
    <tr>
      {#if !isPublic}
        <th style="text-align: center; width: 25px;">
          <button class="raw-button" style="font-size: 12pt" on:click={toggleCheckAll}>
            <i class={"fal " + (!!allBooksSelected ? "fa-check-square" : "fa-square")} />
          </button>
        </th>
      {/if}
      <th style="width: 60px" />
      <th style="min-width: 200px">
        <button class="raw-button bold no-underline" on:click={() => setSort("title")} on:keypress={noop}>
          Title
          {#if sortField == "title"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </button>
      </th>
      <th style="min-width: 90px;">Subjects</th>
      <th style="min-width: 90px;">Tags</th>
      <th style="min-width: 90px;" />
      <th />
      <th style="min-width: 85px; ">
        <button class="raw-button bold no-underline" on:click={() => setSort("pages")}>
          Pages
          {#if sortField == "pages"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </button>
      </th>
      <th>
        <button class="raw-button bold no-underline" on:click={() => setSort("_id")}>
          Added
          {#if sortField == "_id"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </button>
      </th>
    </tr>
  </thead>
  <tbody>
    {#each books as book (book._id)}
      <BookRow {book} {subjects} {tags} {isPublic} />
    {/each}
  </tbody>
</table>
