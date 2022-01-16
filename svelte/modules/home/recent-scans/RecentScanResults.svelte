<script lang="ts">
  import { writable } from "svelte/store";
  import { Queries, QueryOf } from "graphQL/graphql-typings";

  import { query } from "micro-graphql-svelte";

  import Button from "app/components/buttons/Button.svelte";

  import RecentScansQuery from "../../../graphQL/recent-scans/recentScans.graphql";
  import SectionLoading from "app/components/ui/SectionLoading.svelte";
  import "./index.scss";

  const loadNextScans = () => (currentNextPageKey = nextNextPageKey);
  let currentNextPageKey = null;
  let { queryState, sync, resultsState } = query<QueryOf<Queries["recentScanResults"]>>(RecentScansQuery);
  $: sync({ lastKey: currentNextPageKey });

  $: ({ loaded, loading, data } = $queryState);
  $: nextNextPageKey = data?.recentScanResults?.LastEvaluatedKey;

  let currentResults = writable([]);
  let anyResults = false;

  resultsState.subscribe(data => {
    const newResults = data?.recentScanResults?.ScanResults ?? [];
    currentResults.update(current => (current.push(...newResults), current));
  });

  let noResultsMessage;
  $: {
    if ($currentResults.length && !anyResults) {
      anyResults = true;
    }

    noResultsMessage = anyResults ? "No more recent scans" : "No recent scans";
  }
</script>

{#if !loaded}
  <SectionLoading style="margin-top: 50px;" />
{:else}
  <div class="recent-scans-module">
    <div class="overlay-holder">
      <div class="results">
        {#each $currentResults as item, i}
          {#if item.success}
            <img src={item.smallImage} />
            <div>{item.title ?? `${item.isbn} Failure`}</div>
          {:else}
            <div />
            <div>
              <div class="alert alert-danger inline-flex">Failed to lookup isbn {item.isbn}</div>
            </div>
          {/if}
        {/each}

        {#if nextNextPageKey}
          <div />
          <Button preset="info" disabled={loading} onClick={loadNextScans}>Load More</Button>
        {/if}
      </div>
    </div>
    {#if !nextNextPageKey}
      <div class:margin-top-med={anyResults}>
        <hr />
        <div class="alert alert-info">{noResultsMessage}</div>
      </div>
    {/if}
  </div>
{/if}
