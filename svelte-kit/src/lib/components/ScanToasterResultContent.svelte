<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Book } from "$data/types";

  import BookCover from "./BookCover.svelte";

  type Props = {
    book: Book;
    success: boolean;
  };

  let { book, success }: Props = $props();

  let authors = $derived((book.authors ?? []).join(", "));
</script>

<section class="flex w-[300px] gap-2">
  {#if success}
    <BookCover style="width: 60px" {book} size="small" />
  {/if}
  <div class="book-info">
    <div class={cn("text-base leading-none mb-1 w-[225px] whitespace-nowrap overflow-hidden text-ellipsis", { "text-red-500": !success })}>
      {book.title}
    </div>
    <div class="text-sm italic w-[225px] whitespace-nowrap overflow-hidden text-ellipsis">{authors}</div>
  </div>
</section>
