<script lang="ts">
  import { onMount } from "svelte";
  import BarChart from "./barChart/chart/BarChart.svelte";

  import { syncWidth } from "$lib/util/animationHelpers";
  import type { Subject } from "$data/types";
  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";

  const subjects: Subject[] = [];
  const stackedSubjects = stackAndGetTopLevelSubjects(subjects);

  const MAX_CHART_WIDTH = 1100;
  let chartRootEl: any;
  let chartWidth;
  let ready = false;

  onMount(() => {
    chartWidth = syncWidth(chartRootEl);
    ready = true;
  });

  let chartPackets: any[] = [{ subjects: stackedSubjects, header: "All books" }];

  const getDrilldownChart = (index: number, subjects: any, header: any) => {
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
