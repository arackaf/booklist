<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import BookRow from "./BookRow.svelte";

  const isPublic = false;
  const online = true;

  export let books: Book[];
  export let subjects: Subject[];
  export let tags: Tag[];
  const noop = () => {};
  function toggleCheckAll() {}

  const setSort = (arg: string) => {};

  const sortDirection: string = "desc";
  const sort: string = "_id";
  const bookSelection = {
    allAreChecked: false
  };
</script>

<table style="position: relative; align-self: start;" class="table no-padding-top">
  <thead>
    <tr>
      {#if !isPublic && online}
        <th style="text-align: center; width: 25px;">
          <a style="font-size: 12pt" on:click={toggleCheckAll} on:keypress={noop}>
            <i class={"fal " + (!!bookSelection.allAreChecked ? "fa-check-square" : "fa-square")} />
          </a>
        </th>
      {/if}
      <th style="width: 60px" />
      <th style="min-width: 200px">
        <a class="no-underline" on:click={() => setSort("title")} on:keypress={noop}>
          Title
          {#if sort == "title"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </a>
      </th>
      <th style="min-width: 90px;">Subjects</th>
      <th style="min-width: 90px;">Tags</th>
      <th style="min-width: 90px;" />
      <th />
      <th style="min-width: 85px; ">
        <a class="no-underline" on:click={() => setSort("pages")} on:keypress={noop}>
          Pages
          {#if sort == "pages"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </a>
      </th>
      <th>
        <a class="no-underline" on:click={() => setSort("_id")} on:keypress={noop}>
          Added
          {#if sort == "_id"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </a>
      </th>
    </tr>
  </thead>
  <tbody>
    {#each books as book (book._id)}
      <BookRow {book} {subjects} {tags} {isPublic} {online} />
    {/each}
  </tbody>
</table>
