<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import type { BookSubjectStack, Hash, Subject } from "$data/types";

  import { syncWidth } from "$lib/util/animationHelpers";
  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";
  import BarChart from "./barChart/chart/BarChart.svelte";

  const subjects: Subject[] = $page.data.subjects;
  const subjectHash: Hash<Subject> = $page.data.subjectHash;
  const stackedSubjects = stackAndGetTopLevelSubjects(subjects);

  const books: BookSubjectStack[] = $page.data.books;

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
        drilldown={getDrilldownChart.bind(null, i)}
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
