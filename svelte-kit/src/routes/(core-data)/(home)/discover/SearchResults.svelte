<script lang="ts">
  import { quadIn, quadOut } from "svelte/easing";

  import type { Book } from "$data/types";

  import SearchResult from "./SearchResult.svelte";

  export let selectedBooksSet: Set<number>;
  export let books: any[];
  export let currentQuery: string;
  export let selectBook: (book: Book) => void;

  const resultsIn: any = () => {
    return {
      duration: 250,
      css: (t: number) => `opacity: ${quadOut(t)}`
    };
  };
  const resultsOut: any = () => {
    return {
      duration: 200,
      css: (t: number) => `position: absolute; opacity: ${quadIn(t)}; transform: translateX(${(1 - quadOut(t)) * 90}%)`
    };
  };
</script>

<div style="overflow-y: auto; overflow-x: hidden; max-height: 300px; margin-top: 5px; position: relative">
  <div class="overlay-holder">
    {#if books?.length}
      {#key currentQuery}
        <div in:resultsIn|local out:resultsOut|local class="flex flex-col min-w-0">
          {#each books.filter(b => !selectedBooksSet.has(b.id)) as book (book.id)}
            <SearchResult {book} {selectBook} />
          {/each}
        </div>
      {/key}
    {/if}
  </div>
</div>
