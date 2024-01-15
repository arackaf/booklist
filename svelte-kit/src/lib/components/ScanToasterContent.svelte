<script lang="ts">
  import type { Book } from "$data/types";
  import BookCover from "./BookCover.svelte";

  export let book: Book;

  $: authors = (book.authors ?? []).join(", ");
</script>

<section class="flex w-[300px] gap-1">
  <BookCover style="width: 60px" {book} size="small" />
  <div class="book-info">
    <div class="text-base leading-none mb-1 w-[225px] whitespace-nowrap overflow-hidden text-ellipsis">{book.title}</div>
    <div class="text-sm italic w-[225px] whitespace-nowrap overflow-hidden text-ellipsis">{authors}</div>
  </div>
</section>
