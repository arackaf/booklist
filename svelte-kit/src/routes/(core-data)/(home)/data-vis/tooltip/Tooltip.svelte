<script lang="ts">
  import type { Data } from "./tooltipUtils";
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  import type { createTooltipState } from "./tooltipState";

  export let shown: boolean;
  export let data: Data;
  export let drilldown: any;
  export let remove: (id: string) => void;
  export let x: number;
  export let y: number;
  export let measure = false;
  let nextPositionImmediate = true;

  const positionSpring = spring({ x, y }, { stiffness: 0.1, damping: 0.5 });
  const opacitySpring = spring(0, { stiffness: 0.1, damping: 0.5 });
  const runDrilldown = () => drilldown(data.childSubjects, data.display);

  const tooltipState = getContext("tooltip-state") as ReturnType<typeof createTooltipState>;

  let fadeTimeout: null | NodeJS.Timeout = null;

  $: currentData = data ?? {};

  function getFadeTimeout() {
    return fadeTimeout;
  }

  let gone = true;
  let dead = false;

  function isDead() {
    return dead;
  }

  $: {
    if (!measure) {
      let isShown = shown;
      console.log({ isShown });
      if (isShown) {
        dead = false;
      }

      const currentTimeout = getFadeTimeout();
      if (currentTimeout) {
        clearTimeout(currentTimeout);
        fadeTimeout = null;
      }

      gone = false;
      opacitySpring.set(isShown ? 1 : 0, { hard: !isShown && isDead() }).then(() => {
        fadeTimeout = null;
        gone = !isShown;
      });
    }
  }

  $: {
    if (x !== 0 && y !== 0) {
      positionSpring
        .set(
          {
            x: x,
            y: y
          },
          { hard: nextPositionImmediate }
        )
        .then(() => {
          nextPositionImmediate = false;
        });
    }
  }
</script>

<div
  role="contentinfo"
  on:mouseenter={() => {
    if (!dead) {
      tooltipState.reShow();
      tooltipState.onHover();
    }
  }}
  on:mouseleave={() => {
    tooltipState.hide();
    tooltipState.onMouseLeave();
  }}
  class="tooltip-root flex flex-col gap-3 bg-white border rounded md:p-2 p-[6px] {measure ? '' : 'fixed'}"
  style="left: {$positionSpring.x}px; top: {$positionSpring.y}px; opacity: {$opacitySpring}; visibility: {gone || dead ? 'hidden' : 'visible'}"
>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <div class="flex items-baseline gap-2 md:text-lg text-xs">
        <div class="flex flex-col gap-1">
          {#each currentData.entries ?? [] as entry}
            <span class="name">{entry.name}</span>
          {/each}
        </div>
        <button
          class="raw-button flex ml-auto"
          on:click={() => {
            dead = true;
            tooltipState.hide();
            remove(currentData.groupId);
          }}><i class="fad fa-times-circle"></i></button
        >
      </div>
      <hr class="border-slate-600 my-0" />
    </div>
    <div class="md:text-base text-xs pl-1">
      <span>{currentData.count} {currentData.count === 1 ? "Book" : "Books"}</span>
    </div>
    {#if currentData.childSubjects?.length}
      <div class="md:text-base text-xs pl-1">
        <button
          on:click={() => {
            runDrilldown();
            gone = true;
          }}
          class="raw-button flex gap-2"
        >
          <span class="leading-none text-black">Drilldown</span>
          <i class="far fa-chart-bar leading-none text-black"></i>
        </button>
      </div>
    {/if}
  </div>
</div>
