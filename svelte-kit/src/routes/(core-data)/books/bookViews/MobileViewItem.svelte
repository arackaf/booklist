<script lang="ts">
  import type { Book } from "$data/types";

  import BookCover from "$lib/components/BookCover.svelte";
  import SubTitleText from "$lib/components/BookDisplay/SubTitleText.svelte";

  type Props = {
    book: Book;
    previewBook: (book: Book) => void;
  };

  let { book, previewBook }: Props = $props();
</script>

<div
  onclick={() => previewBook(book)}
  onkeydown={() => {}}
  role="button"
  tabindex={-1}
  class="py-1 border-b border-b-neutral-400 first:border-t-primary first:border-t-2 hover:bg-secondary"
>
  <div style="display: flex">
    <div style="margin-right: 5px; min-width: 40px">
      <BookCover size="mobile" {book} />
    </div>
    <div class="overflow-hidden flex-1 mr-1">
      <div class="flex flex-col h-full overflow-hidden">
        <span class="text-sm leading-[normal] truncate">{book.title}</span>
        <SubTitleText>{book.authors.length ? book.authors.join(", ") : ""}</SubTitleText>
      </div>
    </div>
  </div>
</div>
