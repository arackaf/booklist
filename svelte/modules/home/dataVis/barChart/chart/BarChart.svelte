<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { quadOut } from "svelte/easing";
  import { query } from "micro-graphql-svelte";

  import barCharQuery from "graphQL/home/barChart.graphql";

  import { appState } from "app/state/appState";

  import { subjectsState } from "app/state/subjectsState";
  import { stackGraphData } from "../../../stackGraphData";
  import BarChartContent from "./BarChartContent.svelte";

  export let drilldown;
  export let subjects;
  export let header;
  export let chartIndex;
  export let maxWidth;
  export let width;
  export let height;

  $: ({ subjectHash } = $subjectsState);


  let { publicUserId } = $appState;

  const subjectIds = subjects.map(s => s._id);
  const { queryState } = query(barCharQuery, { initialSearch: { subjectIds, searchChildSubjects: true, publicUserId } });

  $: graphData = stackGraphData(subjectHash, subjectIds, $queryState.data);

  const margin = { top: 20, right: 10, bottom: 180, left: 0 };
</script>

{#if !graphData}
  <span>Nothing</span>
{:else if !graphData.length}
  {#if chartIndex == 0}
    <div class="alert alert-warning inline-flex" style="margin-bottom: 75px">
      It looks like there's nothing to show here. Once you add some books to your library, and add subjects to them, they'll show up here.
    </div>
  {:else}
    <div class="alert alert-warning" style="margin: 0 auto 75px auto">
      It looks like the child subjects under
      {header}
      currently have no books assigned
    </div>
  {/if}
{:else}
  <BarChartContent {width} {height} {margin} {maxWidth} {header} {graphData} {drilldown} {chartIndex} />
{/if}
