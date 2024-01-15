<script lang="ts">
  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";

  import { stackGraphData } from "./stackGraphData";
  import BarChartContent from "./bar-chart/chart/BarChartContent.svelte";
  import type { BookSubjectStack, Hash, Subject } from "$data/types";
  import PieChartContent from "./pie-chart/PieChartContent.svelte";
  import { onMount } from "svelte";

  export let books: BookSubjectStack[];
  export let subjectHash: Hash<Subject>;
  export let subjects: Subject[] = [];

  export let drilldown: any;
  export let header: any;
  export let chartIndex: any;
  export let initialChartType: "PIE" | "BAR";

  let chartType: "PIE" | "BAR" = initialChartType;
  const setChartType = (arg: "PIE" | "BAR") => {
    chartType = arg;

    if (chartIndex === 0) {
      fetch("/api/update-ux-settings", { body: JSON.stringify({ initialChart: arg }), method: "POST", credentials: "include" });
    }
  };

  let hasRendered = false;
  let chartContainer: HTMLElement;
  onMount(() => {
    if (chartContainer && chartIndex > 0 && !hasRendered) {
      // smooth behavior seems to be disabled in chrome :(
      window.scrollTo({ top: chartContainer.offsetTop, behavior: "smooth" });
    }
    hasRendered = true;
  });

  $: isBar = chartType === "BAR";
  $: isPie = chartType === "PIE";
  const activeBtnStyle = "transform: scale(1.2)";

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
  <div class="pb-20">
    <div class="flex items-baseline gap-4">
      <div bind:this={chartContainer} class="flex flex-col {chartIndex > 0 ? 'pt-16 -mt-16' : ''}">
        <h4 style="display: inline; text-wrap: nowrap" class="text-xl font-semibold">{header}</h4>
        <div class="flex items-center gap-3 ml-1">
          <button
            on:click={() => setChartType("BAR")}
            style={isBar ? activeBtnStyle : ""}
            class="p-0 bg-transparent border-0 shadow-none"
            class:text-neutral-600={!isBar}
            class:text-primary-5={isBar}
          >
            <i class="fad fa-chart-bar" />
          </button>
          <button
            on:click={() => setChartType("PIE")}
            style={isPie ? activeBtnStyle : ""}
            class="p-0 bg-transparent border-0 shadow-none"
            class:text-neutral-600={!isPie}
            class:text-primary-5={isPie}
          >
            <i class="fad fa-chart-pie" />
          </button>
        </div>
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
      <BarChartContent {showingData} removeBar={remove} {drilldown} {chartIndex} {hasRendered} />
    {:else}
      <PieChartContent {showingData} removeSlice={remove} {drilldown} {chartIndex} {hasRendered} />
    {/if}
  </div>
{/if}
