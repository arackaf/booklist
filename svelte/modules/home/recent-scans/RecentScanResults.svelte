<script lang="ts">
  import { Queries, QueryOf } from "graphql-typings";

  import { query } from "micro-graphql-svelte";
  import RecentScansQuery from "../../../graphQL/recent-scans/recentScans.graphql";

  let currentNextPageKey = null;
  let currentResults = [];
  let { queryState, sync } = query<QueryOf<Queries["recentScanResults"]>>(RecentScansQuery) as any;

  $: console.log("XXX", $queryState);
  queryState.subscribe(newVal => {
    console.log("new val", newVal);
  });
  $: ({ loaded, loading, data } = $queryState);

  $: nextNextPageKey = data?.recentScanResults?.LastEvaluatedKey;
  $: {
    if (data?.recentScanResults?.ScanResults) {
      currentResults = currentResults.concat(data.recentScanResults.ScanResults);
    }
  }

  $: sync({ lastKey: currentNextPageKey });
</script>

YO {loading}
{loaded}
{#if loading}
  <h1>Loading</h1>
{:else}
  {#each currentResults as item}
    <div>
      {item.success ? item.title : item.isbn + " Failure"}
    </div>
  {/each}
  {#if nextNextPageKey}
    <button on:click={() => (currentNextPageKey = nextNextPageKey)}>Load Next</button>
  {/if}
{/if}
