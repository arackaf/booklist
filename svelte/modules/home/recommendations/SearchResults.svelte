<script lang="ts">
  import { fade } from "svelte/transition";
  import { quadIn, quadOut, quintIn, quintOut } from "svelte/easing";

  import SearchResult from "./SearchResult.svelte";

  export let dispatch;
  export let selectedBooksSet;
  export let books: any[];
  export let currentQuery: string;

  const resultsIn: any = () => {
    return {
      duration: 250,
      css: t => `opacity: ${quadOut(t)}`
    };
  };
  const resultsOut: any = () => {
    return {
      duration: 200,
      css: t => `position: absolute; opacity: ${quadIn(t)}; transform: translateX(${(1 - quadOut(t)) * 90}%)`
    };
  };
</script>

<div style="overflow-y: auto; overflow-x: hidden; max-height: 300px; margin-top: 5px; position: relative">
  <div class="overlay-holder">
    {#if books?.length}
      {#key currentQuery}
        <ul in:resultsIn|local out:resultsOut|local>
          {#each books.filter(b => !selectedBooksSet.has(b._id)) as book (book._id)}
            <SearchResult {book} {dispatch} />
          {/each}
        </ul>
      {/key}
    {/if}
  </div>
</div>
