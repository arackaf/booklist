<script lang="ts">
  import type { BookImages } from "$data/types";
  import BookCover from "../ui/BookCover.svelte";
  import Stack from "../layout/Stack.svelte";

  export let packet: BookImages | null;
  export let size: "mobile" | "small" | "medium";
  export let error: boolean;
</script>

<div style="flex: 1">
  {#if !error}
    <Stack inline={true} style="align-items: center; height: 100%">
      <div class="margin-bottom">
        <BookCover {size} book={packet} />
      </div>
    </Stack>
  {/if}
</div>
