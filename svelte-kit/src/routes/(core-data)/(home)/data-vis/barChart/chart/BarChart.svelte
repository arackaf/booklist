<script lang="ts">
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";

  import { stackGraphData } from "../../stackGraphData";
  import BarChartContent from "./BarChartContent.svelte";
  import type { BookSubjectStack, Hash, Subject } from "$data/types";

  export let books: BookSubjectStack[];
  export let subjectHash: Hash<Subject>;
  export let subjects: Subject[] = [];

  export let drilldown: any;
  export let header: any;
  export let chartIndex: any;

  $: subjectIds = subjects.map(s => s.id);

  $: graphData = stackGraphData(subjectHash, subjectIds, books, chartIndex > 0);

  $: ({ hasPublicId } = $page.data);

  const margin = { top: 0, bottom: 0 };
</script>

{#if !graphData.length}
  {#if chartIndex == 0}
    <Alert type="warning">
      It looks like there's nothing to show here. Once you add some books to your library, and add subjects to them, they'll show up here.
    </Alert>
    {#if !hasPublicId}
      <Alert type="warning" class="mt-7">
        If you previously have an account with the old version of this site, your books are safe. Just sync your account&nbsp;
        <a href="/settings/account-sync">here</a>
      </Alert>
    {/if}
  {:else}
    <Alert type="warning">
      It looks like the subjects under {header} currently have no books assigned
    </Alert>
  {/if}
{:else}
  <BarChartContent {margin} {header} {graphData} {drilldown} {chartIndex} />
{/if}
