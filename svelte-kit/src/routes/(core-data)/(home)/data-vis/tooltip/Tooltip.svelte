<script lang="ts">
  import { getContext, untrack } from "svelte";
  import { spring } from "svelte/motion";
  import { ChartColumnBigIcon, XIcon } from "lucide-svelte";

  import Separator from "$lib/components/ui/separator/separator.svelte";

  import type { createTooltipState, TooltipPayload } from "./tooltipState.svelte";

  type Props = {
    shown: boolean;
    payload: TooltipPayload | null;
    x: number;
    y: number;
    measure?: boolean;
  };

  let { shown, payload, x, y, measure = false }: Props = $props();

  let { data, drilldown, remove } = $derived(payload ?? ({} as TooltipPayload));

  const positionSpring = spring({ x, y }, { stiffness: 0.1, damping: 0.5 });
  const opacitySpring = spring(0, { stiffness: 0.1, damping: 0.5 });
  const runDrilldown = () => drilldown(data.childSubjects, data.display);

  const tooltipState = getContext("tooltip-state") as ReturnType<typeof createTooltipState>;

  let fadeTimeout: null | NodeJS.Timeout = $state(null);
  let currentData = $derived(data ?? {});
  let gone = $state(true);
  let dead = $state(false);

  $effect(() => {
    const isDead = untrack(() => dead);

    if (!measure) {
      let isShown = shown;
      if (isShown) {
        dead = false;
      }

      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
        fadeTimeout = null;
      }

      gone = false;
      opacitySpring.set(isShown ? 1 : 0, { hard: !isShown && isDead }).then(() => {
        fadeTimeout = null;
        gone = !isShown;
        if (!isShown) {
          tooltipState.tooltipGone();
        }
      });
    }
  });

  let currentlySetX = $state(x);
  let currentlySetY = $state(y);

  $effect(() => {
    const currentX = untrack(() => currentlySetX);
    const currentY = untrack(() => currentlySetY);

    if (!measure && x !== 0 && y !== 0) {
      if (currentX == x && currentY == y) {
        return;
      }

      currentlySetX = x;
      currentlySetY = y;

      const hard = !tooltipState.currentState.onScreen;
      positionSpring.set({ x, y }, { hard });
      setTimeout(() => tooltipState.tooltipVisible());
    }
  });

  function onMouseEnter() {
    if (!dead) {
      tooltipState.tooltipHover();
    }
  }

  function onMouseLeave() {
    tooltipState.onMouseLeave();
  }
</script>

<div
  role="contentinfo"
  onmouseenter={onMouseEnter}
  onmouseleave={onMouseLeave}
  class="tooltip-root flex flex-col gap-3 bg-white border rounded md:p-2 p-[6px] {measure ? '' : 'fixed'}"
  style="left: {$positionSpring.x}px; top: {$positionSpring.y}px; opacity: {$opacitySpring}; visibility: {gone || dead ? 'hidden' : 'visible'}"
>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-6 md:text-lg text-xs">
        <div class="flex flex-col gap-1">
          {#each currentData.entries ?? [] as entry}
            <span class="name">{entry.name}</span>
          {/each}
        </div>
        <button
          class="raw-button flex ml-auto"
          onclick={() => {
            dead = true;
            tooltipState.hide();
            remove(currentData.groupId);
          }}
          aria-label="Remove"
        >
          <XIcon class="h-5! w-5!" />
        </button>
      </div>
      <Separator class="h-[2px]" />
    </div>
    <div class="md:text-base text-xs pl-1">
      <span>{currentData.count} {currentData.count === 1 ? "Book" : "Books"}</span>
    </div>
    {#if currentData.childSubjects?.length}
      <div class="md:text-base text-xs pl-1">
        <button
          onclick={() => {
            runDrilldown();
            gone = true;
          }}
          class="raw-button flex gap-2 items-center"
        >
          <span>Drilldown</span>
          <ChartColumnBigIcon class="w-4! h-4!" />
        </button>
      </div>
    {/if}
  </div>
</div>
