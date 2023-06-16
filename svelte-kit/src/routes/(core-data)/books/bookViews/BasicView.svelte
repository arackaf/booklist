<script lang="ts">
  import type { Book } from "$data/types";

  import BasicViewItem from "./BasicViewItem.svelte";

  export let isPublic: boolean;
  export let books: Book[];
</script>

<div>
  <div style="padding-bottom: 15px">
    <div style="border: 0" class="listGroup dockedToPanel">
      {#each books as book (book.id)}
        <BasicViewItem {book} {isPublic} />
      {/each}
    </div>
  </div>
</div>
