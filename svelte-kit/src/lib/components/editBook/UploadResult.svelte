<script lang="ts">
  import type { IndividualCoverResult } from "$lambda/types";

  import BookCover from "../ui/BookCover.svelte";
  import Stack from "../layout/Stack.svelte";

  export let packet: IndividualCoverResult | null;
  export let size: "mobile" | "small" | "medium";

  $: STATUS = packet ? packet.STATUS : null;
  $: image = packet ? packet.image : null;
  $: success = STATUS === "success";
</script>

<div style="flex: 1">
  {#if success}
    <Stack inline={true} style="align-items: center; height: 100%">
      <div class="margin-bottom">
        <BookCover {size} url={image?.url} preview={image?.preview} />
      </div>
    </Stack>
  {/if}
</div>
