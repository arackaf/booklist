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
      <BookCover size="mobile" {book} />
    </div>
  </Stack>
  <Stack style="flex: 1" tightest={true}>
    <div>
      <label class="form-label">Standard</label>
      <BookCover size="small" {book} />
    </div>
  </Stack>
  <Stack style="flex: 1" tightest={true}>
    <div>
      <label class="form-label">Full</label>
      <BookCover size="medium" {book} />
    </div>
  </Stack>
</FlowItems>
