<script lang="ts">
  import BookCover from "../BookCover.svelte";

  import type { Book } from "$data/types";

  let { book }: { book: Book } = $props();
</script>

<div class="flex flex-row">
  <div class="flex-1 flex flex-col">
    <span class="text-sm">Mobile</span>
    <BookCover size="mobile" {book} />
  </div>

  <div class="flex-1 flex flex-col">
    <span class="text-sm">Standard</span>
    <BookCover size="small" {book} />
  </div>

  <div class="flex-1 flex flex-col">
    <span class="text-sm">Full</span>
    <BookCover size="medium" {book} />
  </div>
</div>
