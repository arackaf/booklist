<script lang="ts">
  import type { Book } from "$data/types";
  import BookCover from "$lib/components/BookCover.svelte";
  import BookTitle from "$lib/components/BookDisplay/BookTitle.svelte";
  import SubTitleText from "$lib/components/BookDisplay/SubTitleText.svelte";

  type Props = {
    book: Book;
  };

  let { book }: Props = $props();
</script>

<div class="flex flex-row">
  <div class="min-w-[60px]">
    <BookCover size="small" {book} />
  </div>
  <div class="flex flex-col flex-1 min-w-0">
    <BookTitle truncate={true}>
      {book.title}
    </BookTitle>
    {#if book.authors && book.authors.length}
      <SubTitleText>{book.authors.join(", ")}</SubTitleText>

      {#if book.isbn}
        <a target="_new" class="mr-2 mt-auto" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`} aria-label="View on Amazon">
          <i class="fab fa-amazon"></i>
        </a>
      {/if}
    {/if}
  </div>
</div>
