<script lang="ts">
  import type { BookImages } from "$data/types";
  import BookCover from "../BookCover.svelte";

  type Props = {
    packet: BookImages | null;
    size: "mobile" | "small" | "medium";
    error: boolean;
  };

  let { packet, size, error }: Props = $props();
</script>

{#if !error}
  <div>
    <BookCover {size} book={packet} noCoverMessage="Too small" />
  </div>
{/if}
