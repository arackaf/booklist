<script lang="ts">
  import type { MinimalBookInfo } from "$data/types";
  import BookCover from "$lib/components/BookCover.svelte";
  import SubTitleText from "$lib/components/BookDisplay/SubTitleText.svelte";
  import BookTitle from "$lib/components/BookDisplay/BookTitle.svelte";

  type Props = {
    book: MinimalBookInfo;
  };

  let { book }: Props = $props();
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
