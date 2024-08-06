<script lang="ts">
  import { fade } from "svelte/transition";
  import type { Data, Position } from "./tooltip";
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";

  export let shown: boolean;
  export let position: Position;
  export let data: Data;
  export let drilldown: any;
  export let remove: (id: string) => void;
  export let x: string;
  export let y: string;
  export let css: string;

  const positionSpring = spring({ x, y }, { stiffness: 0.1, damping: 0.5 });
  const runDrilldown = () => drilldown(data.childSubjects, data.display);

  $: currentData = data ?? {};

  $: {
    positionSpring.set(
      {
        x: x,
        y: y
      },
      { hard: true }
    );
  }
</script>

<div
  transition:fade={{ delay: 100, duration: 200 }}
  class="tooltip-root flex flex-col gap-3 bg-white border rounded md:p-2 p-[6px] fixed"
  style="transition: transform 200ms ease-out; left: 0; top: 0; transform: translate({$positionSpring.x}, {$positionSpring.y})"
  data-style="left: {$positionSpring.x}px; top: {$positionSpring.y}px; "
>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <div class="flex items-baseline gap-2 md:text-lg text-xs">
        <div class="flex flex-col gap-1">
          {#each currentData.entries ?? [] as entry}
            <span class="name">{entry.name}</span>
          {/each}
        </div>
        <button class="raw-button flex ml-auto" on:click={() => remove(currentData.groupId)}><i class="fad fa-times-circle"></i></button>
      </div>
      <hr class="border-slate-600 my-0" />
    </div>
    <div class="md:text-base text-xs pl-1">
      <span>{currentData.count} {currentData.count === 1 ? "Book" : "Books"}</span>
    </div>
    {#if currentData.childSubjects?.length}
      <div class="md:text-base text-xs pl-1">
        <button on:click={runDrilldown} class="raw-button flex gap-2">
          <span class="leading-none text-black">Drilldown</span>
          <i class="far fa-chart-bar leading-none text-black"></i>
        </button>
      </div>
    {/if}
  </div>
</div>
