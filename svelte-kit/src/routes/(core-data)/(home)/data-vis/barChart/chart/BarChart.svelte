<script lang="ts">
  import { page } from "$app/stores";
  import { stackGraphData } from "../../stackGraphData";
  import BarChartContent from "./BarChartContent.svelte";
  import type { BookSubjectStack, Hash, Subject } from "$data/types";

  export let books: BookSubjectStack[];
  export let subjectHash: Hash<Subject>;
  export let subjects: Subject[] = [];

  export let drilldown: any;
  export let header: any;
  export let chartIndex: any;
  export let height: any;

  $: subjectIds = subjects.map(s => s._id);

  $: graphData = stackGraphData(subjectHash, subjectIds, books, chartIndex > 0);

  $: ({ hasPublicId } = $page.data);

  const margin = { top: 30, bottom: 180 };
</script>

{#if !graphData.length}
  {#if chartIndex == 0}
    <div class="alert alert-warning">
      It looks like there's nothing to show here. Once you add some books to your library, and add subjects to them, they'll show up here.
    </div>
    {#if !hasPublicId}
      <div class="alert alert-warning" style="margin-top: 20px; margin-bottom: 75px">
        If you previously have an account with the old version of this site, your books are safe. Just sync your account&nbsp;
        <a href="/settings/account-sync">here</a>
      </div>
    {/if}
  {:else}
    <div class="alert alert-warning" style="margin: 0 auto 75px auto">
      It looks like the subjects under {header} currently have no books assigned
    </div>
  {/if}
{:else}
  <BarChartContent {height} {margin} {header} {graphData} {drilldown} {chartIndex} />
{/if}
