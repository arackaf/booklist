<script lang="ts">
  import "./index.scss";

  import ActionButton from "$lib/components/ui/Button/ActionButton.svelte";
  import BookCover from "$lib/components/ui/BookCover.svelte";

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

<div class="recent-scans-module mt-5">
  <div class="overlay-holder">
    <div class="results">
      {#each $scans as item}
        {#if item.success}
          <BookCover size="small" book={item} />

          <div>{item.title ?? `${item.isbn} Failure`}</div>
        {:else}
          <div />
          <div>
            <div class="alert alert-danger inline-flex">Failed to lookup isbn {item.isbn}</div>
          </div>
        {/if}
      {/each}

      {#if $nextPageKey}
        <div />
        <ActionButton theme="primary" running={loading} on:click={loadNextScans}>Load More</ActionButton>
      {/if}
    </div>
  </div>
  {#if !$nextPageKey}
    <div>
      {#if $scans.length}
        <hr class="my-3" />
      {/if}
      <div class="alert alert-info">{noResultsMessage}</div>
    </div>
  {/if}
</div>
