<script lang="ts">
  import { onMount } from "svelte";
  import BarChart from "./barChart/chart/BarChart.svelte";

  import { syncWidth } from "app/animationHelpers";
  import { stackedSubjects } from "app/state/subjectsState";

  const MAX_CHART_WIDTH = 1100;
  let chartRootEl;
  let chartWidth;
  let ready = false;

  onMount(() => {
    chartWidth = syncWidth(chartRootEl);
    ready = true;
  });

  $: ({ subjects, subjectsLoaded } = $stackedSubjects);
  let chartPackets = [];
  $: {
    if (subjectsLoaded) {
      chartPackets = [{ subjects, header: "All books" }];
    }
  }

  const getDrilldownChart = (index, subjects, header) => {
    chartPackets = [...chartPackets.slice(0, index + 1), { subjects: subjects.concat(), header }];
  };
</script>

<div bind:this={chartRootEl}>
  {#if ready}
    {#each chartPackets as packet, i (packet.header)}
      <BarChart drilldown={getDrilldownChart} {...packet} chartIndex={i} maxWidth={MAX_CHART_WIDTH} width={$chartWidth} height={600} />
    {/each}
  {/if}
</div>
