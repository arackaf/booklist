<script lang="ts">
  import type { Data, Position } from "./tooltip";

  export let position: Position;
  export let data: Data;
  export let drilldown: any;
  export let removeBar: (id: string) => void;
  export let barElement: SVGElement;

  let style = "";

  $: {
    const barRect = barElement.getBoundingClientRect();
    const barWidth = barRect.width;
    if (position === "top-left") {
      style = `left: calc(${Math.round(barWidth / 2)}px - var(--arrow-offset))`;
    } else if (position === "top-right") {
      style = `right: calc(${Math.round(barWidth / 2)}px - var(--arrow-offset))`;
    }
  }

  const runDrilldown = () => drilldown(data.childSubjects, data.display);
</script>

<div class={"tooltip-root flex flex-col gap-3 bg-slate-400 text-black rounded md:p-2 p-[6px] " + position}>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <div class="flex items-baseline gap-2 md:text-lg text-xs">
        <span class="name">{data.display}</span>
        <button class="raw-button flex ml-auto" on:click={() => removeBar(data.groupId)}><i class="fad fa-times-circle" /></button>
      </div>
      <hr class="border-slate-600 my-0" />
    </div>
    <div class="md:text-base text-xs pl-1">
      <span>{data.count} {data.count === 1 ? "Book" : "Books"}</span>
    </div>
    {#if data.childSubjects?.length}
      <div class="md:text-base text-xs pl-1">
        <button on:click={runDrilldown} class="raw-button flex gap-2">
          <span class="leading-none text-black">Drilldown</span>
          <i class="far fa-chart-bar leading-none text-black" />
        </button>
      </div>
    {/if}
  </div>

  <div class="arrow" {style} />
</div>
