<script lang="ts">
  import type { BookWithSimilarItems, SimilarBook } from "$data/types";

  export let book: BookWithSimilarItems;

  $: hasSimilarBooks = Array.isArray(book.similarBooks) && book.similarBooks.length;
  $: similarBooksCount = hasSimilarBooks ? book.similarBooks!.length : 0;

  let expanded = false;
  let similarBooks: SimilarBook[] = [];

  async function expand() {
    if (expanded) {
      expanded = false;
      return;
    } else if (similarBooks.length) {
      expanded = true;
      return;
    }
    const resultsResp = await fetch("/api/similar-books?id=" + book.id);
    const similarBooksFound = await resultsResp.json();

    similarBooks = similarBooksFound;
    expanded = true;
  }
</script>

{#if hasSimilarBooks}
  <div class="alert alert-success">
    <span>
      {similarBooksCount} similar book{similarBooksCount === 1 ? "" : "s"}
    </span>
    <button on:click={expand}>Get</button>
  </div>
  {#if expanded}
    {#each similarBooks as book}
      {book.title}
    {/each}
  {/if}
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
