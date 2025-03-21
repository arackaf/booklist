<script lang="ts">
  import { onMount } from "svelte";
  import { ChartColumnBigIcon, ChartPieIcon, MessageCircleWarningIcon, RedoIcon, TerminalIcon } from "lucide-svelte";

  import { page } from "$app/stores";
  import type { BookSubjectStack, Hash, Subject } from "$data/types";

  import { cn } from "$lib/utils";
  import * as Alert from "$lib/components/ui/alert/index.js";

  import { stackGraphData } from "./stackGraphData";
  import BarChartContent from "./bar-chart/chart/BarChartContent.svelte";
  import PieChartContent from "./pie-chart/PieChartContent.svelte";

  type Props = {
    books: BookSubjectStack[];
    subjectHash: Hash<Subject>;
    subjects?: Subject[];
    drilldown: any;
    header: any;
    chartIndex: any;
    initialChartType: "PIE" | "BAR";
  };

  let { books, subjectHash, subjects = [], drilldown, header, chartIndex, initialChartType }: Props = $props();

  let chartType = $state<"PIE" | "BAR">(initialChartType);
  const setChartType = (arg: "PIE" | "BAR") => {
    chartType = arg;

    if (chartIndex === 0) {
      fetch("/api/update-ux-settings", { body: JSON.stringify({ initialChart: arg }), method: "POST", credentials: "include" });
    }
  };

  let hasRendered = $state(false);
  let chartContainer = $state<HTMLElement | null>(null);
  onMount(() => {
    if (chartContainer && chartIndex > 0 && !hasRendered) {
      // smooth behavior seems to be disabled in chrome :(
      window.scrollTo({ top: chartContainer.offsetTop, behavior: "smooth" });
    }
    hasRendered = true;
  });

  let isBar = $derived(chartType === "BAR");
  let isPie = $derived(chartType === "PIE");
  const activeBtnStyle = "transform: scale(1.2)";

  let subjectIds = $derived(subjects.map(s => s.id));

  let graphData = $derived(stackGraphData(subjectHash, subjectIds, books, chartIndex > 0));

  let { hasPublicId } = $derived($page.data);

  let excluding = $state({});
  let excludedCount = $derived(Object.keys(excluding).filter(k => excluding[k]).length);

  let showingData = $derived(
    graphData
      .filter(d => !excluding[d.groupId])
      .map((data: any) => {
        data.childSubjects = data.entries.reduce((subjects: any, { children: theseChildren }: any) => subjects.concat(theseChildren), [] as any);
        return data;
      })
  );

  const remove = (id: any) => (excluding = { ...excluding, [id]: true });
  const restore = (id: any) => (excluding = { ...excluding, [id]: false });
</script>

{#if !graphData.length}
  {#if chartIndex == 0}
    <Alert.Root>
      <TerminalIcon class="size-4" />
      <Alert.Title>Hi there!</Alert.Title>
      <Alert.Description>
        It looks like there's nothing to show. Once you add some books to your library, and add subjects to them, they'll show up here.
      </Alert.Description>
    </Alert.Root>
  {:else}
    <Alert.Root>
      <MessageCircleWarningIcon class="size-4" />
      <Alert.Title>Oops</Alert.Title>
      <Alert.Description>
        It looks like the subjects under {header} currently have no books assigned
      </Alert.Description>
    </Alert.Root>
  {/if}
{:else}
  <div class="pb-20">
    <div class="flex items-baseline gap-4">
      <div bind:this={chartContainer} class="flex flex-col gap-2 {chartIndex > 0 ? 'pt-16 -mt-16' : ''}">
        <h4 style="display: inline; text-wrap: nowrap" class="text-xl font-semibold">{header}</h4>
        <div class="flex items-center gap-3 ml-1">
          <button
            onclick={() => setChartType("BAR")}
            style={isBar ? activeBtnStyle : ""}
            class={cn("p-0 bg-transparent border-0 shadow-none", { "text-muted-foreground": !isBar })}
            aria-label="View bar chart"
          >
            <ChartColumnBigIcon size={16} />
          </button>
          <button
            onclick={() => setChartType("PIE")}
            style={isPie ? activeBtnStyle : ""}
            class={cn("p-0 bg-transparent border-0 shadow-none", { "text-muted-foreground": !isPie })}
            aria-label="View pie chart"
          >
            <ChartPieIcon size={16} />
          </button>
        </div>
      </div>

      <div class="flex flex-wrap">
        {#if excludedCount}
          <span>Excluding: </span>
          {#each graphData.filter(d => excluding[d.groupId]) as d}
            <div class="flex items-center gap-2">
              <span style="margin-left: 10px; text-wrap: nowrap">
                {" " + d.display}
              </span>
              <button class="raw-button" style="color: black" onclick={() => restore(d.groupId)} aria-label="Put back into the graph">
                <RedoIcon />
              </button>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    {#if chartType === "BAR"}
      <BarChartContent {showingData} removeBar={remove} {drilldown} />
    {:else}
      <PieChartContent {showingData} removeSlice={remove} {drilldown} {hasRendered} />
    {/if}
  </div>
{/if}
