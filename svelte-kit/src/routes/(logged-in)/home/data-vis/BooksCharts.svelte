<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import BarChart from "./barChart/chart/BarChart.svelte";

  import { syncWidth } from "$lib/util/animationHelpers";
  import type { Book, Subject } from "$data/types";
  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";
  import { toHash } from "$lib/state/helpers";

  const subjects: Subject[] = $page.data.subjects;
  const subjectHash = toHash(subjects);
  const books: Book[] = $page.data.books;
  const stackedSubjects = stackAndGetTopLevelSubjects(subjects);

  const MAX_CHART_WIDTH = 1100;
  let chartRootEl: any;
  let chartWidth;
  let ready = false;

  onMount(() => {
    chartWidth = syncWidth(chartRootEl);
    ready = true;
  });

  let chartPackets: { subjects: Subject[]; header: string }[] = [{ subjects: stackedSubjects, header: "All books" }];

  const getDrilldownChart = (index: number, subjects: any, header: any) => {
    chartPackets = [...chartPackets.slice(0, index + 1), { subjects: subjects.concat(), header }];
  };
</script>

<div bind:this={chartRootEl}>
  {#if ready}
    {#each chartPackets as packet, i (packet.header)}
      <BarChart
        drilldown={getDrilldownChart}
        subjects={packet.subjects}
        {subjectHash}
        header={packet.header}
        {books}
        chartIndex={i}
        width={$chartWidth}
        height={600}
      />
    {/each}
  {/if}
</div>
