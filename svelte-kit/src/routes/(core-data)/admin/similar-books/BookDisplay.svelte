<script lang="ts">
  import type { MinimalBookInfo } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import BookAuthor from "$lib/components/ui/BookDisplay/BookAuthor.svelte";
  import BookTitle from "$lib/components/ui/BookDisplay/BookTitle.svelte";
  export let book: MinimalBookInfo;
</script>

<div class="book-data">
  <BookCover size="small" {book} preview={book.smallImagePreview} />
  <div class="book-title-author">
    <BookTitle truncate={true}>{book.title}</BookTitle>
    <BookAuthor>
      <div>
        {book.authors}
      </div>
      <div>
        {book.isbn}
      </div>
    </BookAuthor>
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
