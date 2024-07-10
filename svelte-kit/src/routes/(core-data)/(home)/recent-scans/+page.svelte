<script lang="ts">
  import Alert from "$lib/components/Alert.svelte";
  import ActionButton from "$lib/components/Button/ActionButton.svelte";
  import BookCover from "$lib/components/BookCover.svelte";

  export let data;

  $: ({ scans, nextPageKey } = data);

  let loading: boolean;

  function loadNextScans() {
    loading = true;

    fetch(`/api/recent-scans?next-page-key=${$nextPageKey}`)
      .then(resp => resp.json())
      .then(resp => {
        scans.update(current => current.concat(resp.scans));
        nextPageKey.set(resp.nextPageKey);

        loading = false;
      });
  }

  let noResultsMessage: string;

  $: noResultsMessage = $scans.length ? "No more recent scans" : "No recent scans";
</script>

<div class="recent-scans-module">
  <div class="overlay-holder">
    <div class="grid grid-cols-[75px_1fr] gap-4">
      {#each $scans as item}
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

      {#if $nextPageKey}
        <div></div>
        <ActionButton class="w-[40ch]" theme="primary" running={loading} onclick={loadNextScans}>Load More</ActionButton>
      {/if}
    </div>
  </div>
  {#if !$nextPageKey}
    <div>
      {#if $scans.length}
        <hr class="my-3" />
      {/if}
      <Alert type="info">
        {noResultsMessage}
      </Alert>
    </div>
  {/if}
</div>
