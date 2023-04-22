<script lang="ts">
  import type { BookWithSimilarItems } from "$data/types";

  export let book: BookWithSimilarItems;

  $: hasSimilarBooks = Array.isArray(book.similarBooks) && book.similarBooks.length;
  $: similarBooksCount = hasSimilarBooks ? book.similarBooks!.length : 0;
</script>

{#if hasSimilarBooks}
  <div class="alert alert-success">
    {similarBooksCount} similar book{similarBooksCount === 1 ? "" : "s"}
  </div>
{:else}
  no
{/if}

<style>
  .alert {
    width: 50%;
  }
</style>
