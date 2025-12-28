<script lang="ts">
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import BookCover from "$lib/components/BookCover.svelte";
  import type { Ref } from "$lib/state/reactivityHelpers.svelte";

  type Props = {
    data: {
      scans: Ref<any[]>;
    };
  };

  let { data }: Props = $props();

  let { scans } = $derived(data);
  let initialPageLength = $derived(scans.value.length);
  let noResults = $derived(initialPageLength === 0);
  let lastDynamicPageHasMoreResults = $state(true);
  let hasMoreResults = $derived(initialPageLength === 10 || lastDynamicPageHasMoreResults);
  let nextOffset = $state(10);

  let loading = $state(false);

  function loadNextScans() {
    loading = true;

    fetch(`/api/recent-scans?offset=${nextOffset}`)
      .then(resp => resp.json())
      .then(resp => {
        lastDynamicPageHasMoreResults = resp.scans.length === 10;

        scans.value = scans.value.concat(resp.scans);
        nextOffset = resp.nextOffset;
        loading = false;
      });
  }
</script>

<div class="mb-20">
  <div class="overlay-holder">
    <div class="grid grid-cols-[75px_1fr] gap-4">
      {#if noResults}
        <div></div>
        <div>No recent scans</div>
      {/if}
      {#each scans.value as item}
        {#if item.status === "SUCCESS"}
          <BookCover size="small" book={item.bookInfo} />

          <div>{item.bookInfo.title || `${item.isbn} Failure`}</div>
        {:else}
          <div></div>
          <div class="text-red-500 font-bold text-base">
            Failed to lookup isbn {item.isbn}
          </div>
        {/if}
      {/each}

      {#if hasMoreResults}
        <div></div>
        <Button class="w-[40ch]" disabled={loading} onclick={loadNextScans}>Load More</Button>
      {/if}
    </div>
  </div>
  {#if !hasMoreResults}
    <div>
      <Separator class="my-4 h-[2px]" />
      <div class="text-lg font-bold">No more recent scans</div>
    </div>
  {/if}
</div>
