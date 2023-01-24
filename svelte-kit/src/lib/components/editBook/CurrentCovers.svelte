<script lang="ts">
  import BookCover from "../ui/BookCover.svelte";

  import FlowItems from "../layout/FlowItems.svelte";
  import Stack from "../layout/Stack.svelte";
  import type { Book } from "$data/types";

  export let book: Book;
</script>

<FlowItems>
  <Stack style="flex: 1" tightest={true}>
    <div>
      <label class="form-label">Mobile</label>
      <BookCover size="mobile" url={book.mobileImage} preview={book.mobileImagePreview} />
    </div>
  </Stack>
  <Stack style="flex: 1" tightest={true}>
    <div>
      <label class="form-label">Standard</label>
      <BookCover size="small" url={book.smallImage} preview={book.smallImagePreview} />
    </div>
  </Stack>
  <Stack style="flex: 1" tightest={true}>
    <div>
      <label class="form-label">Full</label>
      <BookCover size="medium" url={book.mediumImage} preview={book.mediumImagePreview} />
    </div>
  </Stack>
</FlowItems>
