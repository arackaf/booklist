<script lang="ts">
  import { writable } from "svelte/store";
  import { Queries, QueryOf } from "graphql-typings";

  import { query } from "micro-graphql-svelte";
  import RecentScansQuery from "../../../graphQL/recent-scans/recentScans.graphql";
  import SectionLoading from "app/components/ui/SectionLoading.svelte";

  let currentNextPageKey = null;
  let { queryState, sync, resultsState } = query<QueryOf<Queries["recentScanResults"]>>(RecentScansQuery);

  $: ({ loaded, loading, data } = $queryState);
  $: nextNextPageKey = data?.recentScanResults?.LastEvaluatedKey;

  $: sync({ lastKey: currentNextPageKey });

  let currentResults = writable([]);
  resultsState.subscribe(data => {
    let newResults = data?.recentScanResults?.ScanResults;
    if (newResults) {
      currentResults.update(current => (current.push(...newResults), current));
    }
  });

  const loadNextScans = () => (currentNextPageKey = nextNextPageKey);
</script>

{#if !loaded}
  <SectionLoading style="margin-top: 50px;" />
{/if}

{#each $currentResults as item}
  <div>
    {item.success ? item.title : item.isbn + " Failure"}
  </div>
{/each}
{#if nextNextPageKey}
  <button disabled={loading} on:click={loadNextScans}>Load Next</button>
{/if}
