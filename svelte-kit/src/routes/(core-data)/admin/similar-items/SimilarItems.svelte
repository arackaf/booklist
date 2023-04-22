<script lang="ts">
  import type { BookWithSimilarItems, SimilarBook } from "$data/types";
  import SlideAnimate from "$lib/util/SlideAnimate.svelte";

  export let book: BookWithSimilarItems;

  $: hasSimilarBooks = Array.isArray(book.similarBooks) && book.similarBooks.length;
  $: similarBooksCount = hasSimilarBooks ? book.similarBooks!.length : 0;

  let expanded = false;
  let similarBooks: SimilarBook[] = [];

  async function expand() {
    if (expanded) {
      expanded = false;
    } else if (similarBooks.length) {
      expanded = true;
    } else {
      const resultsResp = await fetch("/api/similar-books?id=" + book.id);
      const similarBooksFound = await resultsResp.json();

      similarBooks = similarBooksFound;
      expanded = true;
    }
  }
</script>

{#if hasSimilarBooks}
  <div class="alert alert-success">
    <span>
      {similarBooksCount} similar book{similarBooksCount === 1 ? "" : "s"}
    </span>
    <button on:click={expand}>Get</button>
  </div>
  <SlideAnimate open={expanded}>
    {#each similarBooks as book}
      {book.title}
    {/each}
  </SlideAnimate>
{:else}
  no
{/if}

<style>
  .alert {
    width: 50%;
  }
  .alert button {
    margin-left: auto;
  }
</style>
