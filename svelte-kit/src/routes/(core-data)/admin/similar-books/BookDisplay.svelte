<script lang="ts">
  import type { MinimalBookInfo } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  export let book: MinimalBookInfo;
</script>

<div class="book-data">
  <BookCover size="small" {book} preview={book.smallImagePreview} />
  <div class="book-title-author">
    <span class="book-title no-overflow">{book.title}</span>
    <span class="book-author">{book.authors}</span>
  </div>
</div>

<style>
  .book-data {
    display: flex;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .book-title-author {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 1200px) {
    .book-data {
      flex: 2;
    }
  }
  @media (max-width: 1000px) {
    .book-data {
      flex: 1;
    }
  }
</style>
