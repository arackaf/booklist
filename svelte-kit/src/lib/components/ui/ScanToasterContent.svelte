<script lang="ts">
  import type { Book } from "$data/types";
  import BookCover from "./BookCover.svelte";

  export let book: Book;

  $: authors = (book.authors ?? []).join(", ");
</script>

<section>
  <BookCover style="width: 60px" {book} size="small" />
  <div class="book-info">
    <div class="title">{book.title}</div>
    <div class="authors">{authors}</div>
  </div>
</section>

<style>
  section {
    width: 300px;
    display: flex;
    flex-direction: row;
  }

  .title,
  .authors {
    width: 225px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title {
    font-size: 18px;
    line-height: 1;
    margin-bottom: 3px;
  }
  .authors {
    font-size: 12px;
    font-style: italic;
  }
</style>
