<script lang="ts">
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";

  import { stackGraphData } from "./stackGraphData";
  import BarChartContent from "./bar-chart/chart/BarChartContent.svelte";
  import type { BookSubjectStack, Hash, Subject } from "$data/types";
  import PieChartContent from "./pie-chart/PieChartContent.svelte";

  export let books: BookSubjectStack[];
  export let subjectHash: Hash<Subject>;
  export let subjects: Subject[] = [];

  export let drilldown: any;
  export let header: any;
  export let chartIndex: any;

  export let chartType: "PIE" | "BAR";

  $: subjectIds = subjects.map(s => s.id);

  $: graphData = stackGraphData(subjectHash, subjectIds, books, chartIndex > 0);

  $: ({ hasPublicId } = $page.data);

  let excluding: any = {};
  $: excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;

  $: showingData = graphData
    .filter(d => !excluding[d.groupId])
    .map((data: any) => {
      data.childSubjects = data.entries.reduce((subjects: any, { children: theseChildren }: any) => subjects.concat(theseChildren), [] as any);
      return data;
    });

  const remove = (id: any) => (excluding = { ...excluding, [id]: true });
  const restore = (id: any) => (excluding = { ...excluding, [id]: false });
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
  <div>
    <div class="flex items-baseline gap-4">
      <div class="flex flex-col">
        <h4 style="display: inline; text-wrap: nowrap" class="text-xl font-semibold">{header}</h4>
        <span>xxx</span>
      </div>
      <div class="flex flex-wrap">
        {#if excludedCount}
          <span>Excluding: </span>
          {#each graphData.filter(d => excluding[d.groupId]) as d}
            <span style="margin-left: 10px; text-wrap: nowrap">
              {" " + d.display}
              <button class="raw-button" style="color: black" on:click={() => restore(d.groupId)}>
                <i class="far fa-redo" />
              </button>
            </span>
          {/each}
        {/if}
      </div>
    </div>

    {#if chartType === "BAR"}
      <BarChartContent {showingData} removeBar={remove} {drilldown} {chartIndex} />
    {:else}
      <PieChartContent {showingData} removeSlice={remove} {drilldown} {chartIndex} />
    {/if}
  </div>
{/if}
