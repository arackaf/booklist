<script lang="ts">
  import type { BookImages } from "$data/types";
  import BookCover from "../BookCover.svelte";

  export let packet: BookImages | null;
  export let size: "mobile" | "small" | "medium";
  export let error: boolean;
</script>

{#if !error}
  <div>
    <BookCover {size} book={packet} noCoverMessage="Too small" />
  </div>
{/if}
