<script lang="ts">
  import { fade } from "svelte/transition";
  import { quadOut } from "svelte/easing";

  import SearchResult from "./SearchResult.svelte";

  export let data;
  export let dispatch;
  export let selectedBooksSet;
  export let active;

  $: booksObj = data?.allBooks as { Books: any[] };
  $: books = data?.allBooks?.Books;

  $: noResults = active && books != null && !books?.length;
</script>

<div style="overflow-y: auto; overflow-x: hidden; max-height: 300px; margin-top: 5px; position: relative">
  <div className="overlay-holder">
    {#if booksObj?.Books?.length}
      <ul>
        {#each booksObj.Books as book}
          <SearchResult {book} selected={selectedBooksSet.has(book._id)} {dispatch} />
        {/each}
      </ul>
    {/if}

    {#if noResults}
      <div transition:fade={{ duration: 200, easing: quadOut }} style="align-self: start">
        <div class="alert alert-warning">No results</div>
      </div>
    {/if}
  </div>
</div>
