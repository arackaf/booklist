<script lang="ts">
  import type { Book } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import SubTitleText from "$lib/components/ui/BookDisplay/SubTitleText.svelte";

  export let book: Book;
  export let isPublic: boolean;
</script>

<div class="py-1 border-b border-b-neutral-400 listGroupItem first:border-t-primary-8 first:border-t-[2px] hover:bg-primary-10">
  <div style="display: flex">
    <div style="margin-right: 5px; min-width: 55px">
      <BookCover size="mobile" {book} />
    </div>
    <div style="overflow: hidden">
      <div style="display: flex; flex-direction: column; height: 100%">
        <span class="text-sm leading-[normal] truncate">{book.title}</span>
        <SubTitleText>{book.authors.length ? book.authors.join(", ") : ""}</SubTitleText>
      </div>
    </div>
  </div>
</div>
