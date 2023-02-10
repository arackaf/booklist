<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import type { BookSubjectStack, Hash, Subject } from "$data/types";

  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";
  import BarChart from "./data-vis/barChart/chart/BarChart.svelte";

  const subjects: Subject[] = $page.data.subjects;
  const subjectHash: Hash<Subject> = $page.data.subjectHash;
  const stackedSubjects = stackAndGetTopLevelSubjects(subjects);

  const books: BookSubjectStack[] = $page.data.books;

  let ready = false;

  onMount(() => {
    ready = true;
  });

  let chartPackets: { subjects: Subject[]; header: string }[] = [{ subjects: stackedSubjects, header: "All books" }];

  const getDrilldownChart = (index: number, subjects: any, header: any) => {
    chartPackets = [...chartPackets.slice(0, index + 1), { subjects: subjects.concat(), header }];
  };
</script>

<div>
  {#each chartPackets as packet, i (packet.header)}
    <BarChart
      drilldown={getDrilldownChart.bind(null, i)}
      subjects={packet.subjects}
      {subjectHash}
      header={packet.header}
      {books}
      chartIndex={i}
      height={600}
    />
  {/each}
</div>
