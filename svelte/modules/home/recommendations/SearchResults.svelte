<script lang="ts">
  import { fade } from "svelte/transition";
  import { quadIn, quadOut, quintIn, quintOut } from "svelte/easing";

  import SearchResult from "./SearchResult.svelte";

  export let data;
  export let dispatch;
  export let selectedBooksSet;
  export let active;

  $: booksObj = data?.allBooks as { Books: any[] };
  $: books = data?.allBooks?.Books;

  $: noResults = active && books != null && !books?.length;

  const resultsIn: any = () => {
    return {
      duration: 250,
      css: t => `opacity: ${quadOut(t)}`
    };
  };
  const resultsOut: any = () => {
    return {
      duration: 150,
      css: t => `position: absolute; opacity: ${quintOut(t)}; transform: translateX(${quadOut(1 - t) * 90}%)`
    };
  };
</script>

<div style="overflow-y: auto; overflow-x: hidden; max-height: 300px; margin-top: 5px; position: relative">
  <div className="overlay-holder">
    {#if booksObj?.Books?.length}
      {#key booksObj}
        <ul in:resultsIn out:resultsOut>
          {#each booksObj.Books.filter(b => !selectedBooksSet.has(b._id)) as book (book._id)}
            <SearchResult {book} {dispatch} />
          {/each}
        </ul>
      {/key}
    {/if}

    {#if noResults}
      <div transition:fade={{ duration: 200, easing: quadOut }} style="align-self: start">
        <div class="alert alert-warning">No results</div>
      </div>
    {/if}
  </div>
</div>
