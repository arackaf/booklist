<script lang="ts">
  import CoverMobile from "../bookCovers/CoverMobile.svelte";
  import CoverSmall from "../bookCovers/CoverSmall.svelte";
  import CoverMedium from "../bookCovers/CoverMedium.svelte";

  import FlowItems from "../layout/FlowItems.svelte";
  import Stack from "../layout/Stack.svelte";
  import { IBookRaw } from "modules/books/booksState";

  export let book: IBookRaw;
</script>

<FlowItems>
  <Stack style="flex: 1" tightest={true}>
    <div>
      <label class="form-label">Mobile</label>
      <CoverMobile url={book.mobileImage} preview={book.mobileImagePreview} />
    </div>
  </Stack>
  <Stack style="flex: 1" tightest={true}>
    <div>
      <label class="form-label">Standard</label>
      <CoverSmall url={book.smallImage} preview={book.smallImagePreview} />
    </div>
  </Stack>
  <Stack style="flex: 1" tightest={true}>
    <div>
      <label class="form-label">Full</label>
      <CoverMedium url={book.mediumImage} preview={book.mediumImagePreview} />
    </div>
  </Stack>
</FlowItems>
