<script lang="ts">
  import type { Book } from "$data/types";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import BookTitle from "$lib/components/ui/BookDisplay/BookTitle.svelte";
  import SubTitleText from "$lib/components/ui/BookDisplay/SubTitleText.svelte";

  export let book: Book;
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
        <a target="_new" class="margin-right mt-auto" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}>
          <i class="fab fa-amazon" />
        </a>
      {/if}
    {/if}
  </div>
</div>
