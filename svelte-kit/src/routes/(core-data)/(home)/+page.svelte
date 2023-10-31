<script lang="ts">
  import { page } from "$app/stores";

  import type { BookSubjectStack, Subject } from "$data/types";

  import { toHash } from "$lib/state/helpers";
  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";
  import Chart from "./data-vis/Chart.svelte";

  const subjects: Subject[] = $page.data.subjects;
  $: subjectHash = toHash(subjects);
  const stackedSubjects = stackAndGetTopLevelSubjects(subjects);

  const books: BookSubjectStack[] = $page.data.books;

  let chartPackets: { subjects: Subject[]; header: string }[] = [{ subjects: stackedSubjects, header: "All books" }];

  const getDrilldownChart = (index: number, subjects: any, header: any) => {
    chartPackets = [...chartPackets.slice(0, index + 1), { subjects: subjects.concat(), header }];
  };
</script>

<div>
  {#each chartPackets as packet, i (packet.header)}
    <Chart {books} subjects={packet.subjects} {subjectHash} drilldown={getDrilldownChart.bind(null, i)} header={packet.header} chartIndex={i} />
  {/each}
</div>
