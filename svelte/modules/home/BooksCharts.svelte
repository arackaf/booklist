<script lang="ts">
  import { onMount } from "svelte";
  import BarChart from "./BarChart.svelte";

  import { syncWidth } from "app/animationHelpers";
  import { stackedSubjects } from "app/state/subjectsState";

  const MAX_CHART_WIDTH = 1100;
  let chartRootEl;
  let chartWidth;

  onMount(() => {
    chartWidth = syncWidth(chartRootEl);
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
  {#each chartPackets as packet, i}
    <BarChart drilldown={getDrilldownChart} {...packet} chartIndex={i} maxWidth={MAX_CHART_WIDTH} width={$chartWidth} height={600} />
  {/each}
</div>
