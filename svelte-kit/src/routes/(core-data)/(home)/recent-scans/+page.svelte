<script lang="ts">
  import Separator from "$lib/components/ui/separator/separator.svelte";

  import Button from "$lib/components/ui/button/button.svelte";

  import Alert from "$lib/components/Alert.svelte";
  import BookCover from "$lib/components/BookCover.svelte";
  import type { Ref } from "$lib/state/reactivityHelpers.svelte";

  type Props = {
    data: {
      scans: Ref<any[]>;
      nextPageKey: Ref<string | null>;
    };
  };

  let { data }: Props = $props();

  let { scans, nextPageKey } = $derived(data);

  let loading = $state(false);

  function loadNextScans() {
    loading = true;

    fetch(`/api/recent-scans?next-page-key=${nextPageKey.value}`)
      .then(resp => resp.json())
      .then(resp => {
        scans.value = scans.value.concat(resp.scans);
        nextPageKey.value = resp.nextPageKey;

        loading = false;
      });
  }

  let noResultsMessage = $derived(scans ? "No more recent scans" : "No recent scans");
</script>

<div>
  <div class="overlay-holder">
    <div class="grid grid-cols-[75px_1fr] gap-4">
      {#each scans.value as item}
        {#if item.success}
          <BookCover size="small" book={item} />

          <div>{item.title ?? `${item.isbn} Failure`}</div>
        {:else}
          <div></div>
          <div>
            <Alert type="error" class="w-[40ch] inline-flex">
              Failed to lookup isbn {item.isbn}
            </Alert>
          </div>
        {/if}
      {/each}

      {#if nextPageKey.value}
        <div></div>
        <Button class="w-[40ch]" disabled={loading} onclick={loadNextScans}>Load More</Button>
      {/if}
    </div>
  </div>
  {#if !nextPageKey.value}
    <div>
      {#if scans.value.length}
        <Separator class="my-4 h-[2px]" />
      {/if}
      <Alert type="info">
        {noResultsMessage}
      </Alert>
    </div>
  {/if}
</div>
