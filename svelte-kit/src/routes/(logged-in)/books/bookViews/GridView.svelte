<script lang="ts">
  import type { Book } from "$data/types";

  const isPublic = false;
  const online = true;

  export let books: Book[];
  const noop = () => {};
  function toggleCheckAll() {}

  const setSort = (arg: string) => {};

  const sortDirection: string = "desc";
  const sort: string = "_id";
  const bookSelection = {
    allAreChecked: false
  };

  export let menuBarHeight: number;
  $: stickyHeaderStyle = `position: sticky; padding-top: 2px; top: ${menuBarHeight - 4}px; background-color: white; z-index: 2`;
</script>

<table style="position: relative; align-self: start;" class="table no-padding-top">
  <thead>
    <tr>
      {#if !isPublic && online}
        <th style="{stickyHeaderStyle}; text-align: center; width: 25px;">
          <a style="font-size: 12pt" on:click={toggleCheckAll} on:keypress={noop}>
            <i class={"fal " + (!!bookSelection.allAreChecked ? "fa-check-square" : "fa-square")} />
          </a>
        </th>
      {/if}
      <th style="{stickyHeaderStyle}; width: 60px" />
      <th style="{stickyHeaderStyle}; min-width: 200px">
        <a class="no-underline" on:click={() => setSort("title")} on:keypress={noop}>
          Title
          {#if sort == "title"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </a>
      </th>
      <th style="min-width: 90px; {stickyHeaderStyle}">Subjects</th>
      <th style="min-width: 90px; {stickyHeaderStyle}">Tags</th>
      <th style="min-width: 90px; {stickyHeaderStyle}" />
      <th style={stickyHeaderStyle} />
      <th style="min-width: 85px; {stickyHeaderStyle}">
        <a class="no-underline" on:click={() => setSort("pages")} on:keypress={noop}>
          Pages
          {#if sort == "pages"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </a>
      </th>
      <th style={stickyHeaderStyle}>
        <a class="no-underline" on:click={() => setSort("_id")} on:keypress={noop}>
          Added
          {#if sort == "_id"}<i class={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />{/if}
        </a>
      </th>
    </tr>
  </thead>
  <tbody>
    {#each books as book (book._id)}
      <!-- <BookRow {book} {isPublic} {online} /> -->
    {/each}
  </tbody>
</table>
