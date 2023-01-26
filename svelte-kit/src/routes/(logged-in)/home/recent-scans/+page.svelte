<script lang="ts">
  import "./index.scss";

  import type { Writable } from "svelte/store";

  import Button from "$lib/components/buttons/Button.svelte";

  export let data: { scans: Writable<any>; nextPageKey: Writable<string> };

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

<div class="recent-scans-module margin-top-med">
  <div class="overlay-holder">
    <div class="results">
      {#each $scans as item, i}
        {#if item.success}
          <img alt="Book cover" src={item.smallImage} />
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
        <Button preset="info" disabled={loading} onClick={loadNextScans}>Load More</Button>
      {/if}
    </div>
  </div>
  {#if !$nextPageKey}
    <div>
      {#if $scans.length}
        <hr />
      {/if}
      <div class="alert alert-info">{noResultsMessage}</div>
    </div>
  {/if}
</div>
