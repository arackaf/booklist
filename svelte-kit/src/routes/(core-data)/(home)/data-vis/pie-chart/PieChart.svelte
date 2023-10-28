<script lang="ts">
  import PieChartContent from "./PieChartContent.svelte";
  import { stackGraphData } from "../stackGraphData";
  import type { BookSubjectStack, Hash, Subject } from "$data/types";

  export let books: BookSubjectStack[];
  export let subjectHash: Hash<Subject>;
  export let subjects: Subject[] = [];

  export let chartIndex: any;

  $: subjectIds = subjects.map(s => s.id);

  $: graphData = stackGraphData(subjectHash, subjectIds, books, chartIndex > 0);
</script>

<PieChartContent {graphData} />
