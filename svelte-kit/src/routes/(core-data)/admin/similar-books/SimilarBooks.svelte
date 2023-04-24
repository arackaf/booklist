<script lang="ts">
  import type { BookWithSimilarItems, SimilarBook } from "$data/types";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import SlideAnimate from "$lib/util/SlideAnimate.svelte";
  import BookDisplay from "./BookDisplay.svelte";

  export let book: BookWithSimilarItems;

  $: hasSimilarBooks = Array.isArray(book.similarBooks) && book.similarBooks.length;
  $: similarBooksCount = hasSimilarBooks ? book.similarBooks!.length : 0;

  let loading = false;
  let expanded = false;
  let similarBooks: SimilarBook[] = [];

  async function expand() {
    if (expanded) {
      expanded = false;
    } else if (similarBooks.length) {
      expanded = true;
    } else {
      loading = true;
      const resultsResp = await fetch("/api/similar-books?id=" + book.id);
      const similarBooksFound = await resultsResp.json();

      similarBooks = similarBooksFound;
      expanded = true;
      loading = false;
    }
  }
</script>

{#if hasSimilarBooks}
  <div class="alert alert-success">
    <span>
      {similarBooksCount} similar book{similarBooksCount === 1 ? "" : "s"}
    </span>
    <button disabled={loading} class:expanded class="raw-button" on:click={expand}>
      {#if loading}
        <i class="far fa-spinner fa-spin" />
      {:else}
        <i class="far fa-angle-double-down" />
      {/if}
    </button>
  </div>
  <SlideAnimate open={expanded}>
    <div class="similar-books-container">
      {#each similarBooks as book}
        <BookDisplay {book} />
      {/each}
    </div>
  </SlideAnimate>
{:else}
  <div class="alert alert-warning">
    None found. Last attempt {book.similarBooksLastSync}
  </div>
{/if}

<style>
  .similar-books-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
    max-height: 300px;
    overflow-y: scroll;
  }

  .alert {
    width: 50%;
  }
  .alert button {
    margin-left: auto;
  }
  button.expanded i {
    transform: rotate(180deg);
  }
  button:disabled {
    cursor: default;
  }
</style>
