<script lang="ts">
  import BookCover from "../ui/BookCover.svelte";

  import type { Book } from "$data/types";

  export let book: Book;
</script>

<div class="flex flex-row">
  <div class="flex-1 flex flex-col">
    <span class="form-label">Mobile</span>
    <BookCover size="mobile" {book} />
  </div>

  <div class="flex-1 flex flex-col">
    <span class="form-label">Standard</span>
    <BookCover size="small" {book} />
  </div>

  <div class="flex-1 flex flex-col">
    <span class="form-label">Full</span>
    <BookCover size="medium" {book} />
  </div>
</div>
