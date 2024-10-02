<script lang="ts">
  import type { BookSubjectStack, Subject } from "$data/types";

  import { toHash } from "$lib/state/helpers";
  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";
  import type { UxState } from "$lib/util/uxState";
  import Chart from "./data-vis/Chart.svelte";

  type Props = {
    data: {
      uxState: UxState;
      subjects: Subject[];
      books: BookSubjectStack[];
    };
  };

  let { data }: Props = $props();

  let uxState = $derived(data.uxState as UxState);
  let subjects = $derived(data.subjects);
  let books = $derived(data.books);

  let subjectHash = $derived(toHash(subjects));
  let stackedSubjects = $derived(stackAndGetTopLevelSubjects(subjects));

  type ChartPacketType = {
    subjects: Subject[];
    header: string;
    startingChartType?: "PIE" | "BAR";
  };

  let chartPackets = $state<ChartPacketType[]>([]);

  $effect(() => {
    chartPackets = [{ subjects: stackedSubjects, header: "All books", startingChartType: uxState.initialChart || "BAR" }];
  });

  const getDrilldownChart = (index: number, subjects: any, header: any, chartType: "PIE" | "BAR") => {
    chartPackets = [...chartPackets.slice(0, index + 1), { subjects: subjects.concat(), header, startingChartType: chartType }];
  };
</script>

<div>
  {#each chartPackets as packet, i (packet.header)}
    <Chart
      {books}
      subjects={packet.subjects}
      {subjectHash}
      drilldown={getDrilldownChart.bind(null, i)}
      header={packet.header}
      chartIndex={i}
      initialChartType={packet.startingChartType || uxState.initialChart}
    />
  {/each}
</div>
