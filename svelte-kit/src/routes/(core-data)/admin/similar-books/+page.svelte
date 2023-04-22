<script lang="ts">
  import { page } from "$app/stores";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import SimilarItems from "./SimilarBooks.svelte";

  export let data;

  $: ({ books } = data);

  $: console.log({ books });
</script>

<section>
  <div class="list">
    {#each books as book}
      <div class="entry">
        <div class="book-data">
          <BookCover size="small" {book} preview={book.smallImagePreview} />
          <div class="book-title-author">
            <span class="book-title no-overflow">{book.title}</span>
            <span class="book-author">{book.authors}</span>
          </div>
        </div>
        <div class="similar-items">
          <SimilarItems {book} />
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .entry {
    display: flex;
    border: 1px solid var(--neutral-border);
    border-radius: 5px;
    padding: 15px;
    gap: 10px;
    margin-bottom: 10px;
  }

  .book-data {
    display: flex;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  @media (max-width: 1200px) {
    div.book-data {
      flex: 2;
    }
  }
  @media (max-width: 1000px) {
    .entry {
      flex-direction: column;
    }
    div.book-data {
      flex: 1;
    }
  }

  .book-title-author {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
    flex: 1;
    min-width: 0;
  }

  .similar-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>
