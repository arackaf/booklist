<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";
  import BookRow from "./BookRow.svelte";
  import { changeFilter, searchState } from "../state/searchState";
  import { selectedBooks, selectionState } from "../state/selectionState";

  export let isPublic: boolean;
  export let books: Book[];
  export let subjects: Subject[];
  export let tags: Tag[];

  $: ({ sortField, sortDirection } = $searchState);

  $: allBooksSelected = books.length === $selectedBooks.length;
  function toggleCheckAll() {
    if (allBooksSelected) {
      selectionState.clear();
    } else {
      selectionState.selectAll(books);
    }
  }
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
        <a class="bold no-underline" href={$changeFilter.withSort("title")}>
          Title
          {#if sortField == "title"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </a>
      </th>
      <th style="min-width: 90px;">Subjects</th>
      <th style="min-width: 90px;">Tags</th>
      <th style="min-width: 90px;" />
      <th />
      <th style="min-width: 85px; ">
        <a class="bold no-underline" href={$changeFilter.withSort("pages")}>
          Pages
          {#if sortField == "pages"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </a>
      </th>
      <th>
        <a class="bold no-underline" href={$changeFilter.withSort("_id")}>
          Added
          {#if sortField == "_id"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </a>
      </th>
    </tr>
  </thead>
  <tbody>
    {#each books as book (book._id)}
      <BookRow {book} {subjects} {tags} {isPublic} />
    {/each}
  </tbody>
</table>
