<script lang="ts">
  import { page } from "$app/stores";
  import type { Book } from "$data/types";

  import BasicViewItem from "./BasicViewItem.svelte";

  export let isPublic: boolean;
  export let books: Book[];
</script>

<div>
  <div style="padding-bottom: 15px">
    <div style="border: 0" class="listGroup dockedToPanel">
      {#each books as book (book._id)}
        <BasicViewItem {book} {isPublic} />
      {/each}
    </div>
  </div>
</div>

<style>
  :global(.dockedToPanel .listGroupItem:first-child) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  :global(.dockedToPanel .listGroupItem) {
    border-left: 0;
    border-right: 0;
  }

  :global(.listGroup > .listGroupItem:first-of-type) {
    border-top: 2px solid var(--primary-8);
  }
  :global(.listGroup > .listGroupItem:hover) {
    background-color: var(--primary-10);
  }
</style>
