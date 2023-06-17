<script lang="ts">
  import type { MinimalBookInfo } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import SubTitleText from "$lib/components/ui/BookDisplay/SubTitleText.svelte";
  import BookTitle from "$lib/components/ui/BookDisplay/BookTitle.svelte";
  export let book: MinimalBookInfo;
</script>

<div class="flex gap-2 min-w-0 flex-1">
  <BookCover size="small" {book} preview={book.smallImagePreview} />
  <div class="flex flex-col ml-1 flex-1 min-w-0">
    <BookTitle truncate={true}>{book.title}</BookTitle>
    <SubTitleText>
      <div>
        {book.authors}
      </div>
      <div>
        {book.isbn}
      </div>
    </SubTitleText>
  </div>
</div>
