<script lang="ts">
  import { query } from "micro-graphql-svelte";

  import barCharQuery from "gql/home/barChart.graphql";

  import { appState } from "app/state/appState";

  import { subjectsState } from "app/state/subjectsState";
  import { stackGraphData } from "../../../stackGraphData";
  import BarChartContent from "./BarChartContent.svelte";
  import SectionLoading from "app/components/ui/SectionLoading.svelte";

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

  const margin = { top: 30, right: 20, bottom: 180, left: 20 };
</script>

<!-- 
  Don't show the graph until the isReady flag is true, which flips when the module transition is done. Both transitions running causes
  problems I don't fully understand. If we have graphData, just assume the page was cached, and show no spinner. There's a small
  race condition where the data could return faster than the 150ms animation, but the only consequence would be the spinner disappearing
  a few ms too soon
-->
{#if !graphData}
  <SectionLoading style="margin-top: {chartIndex === 0 ? 150 : 20}px;" />
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
