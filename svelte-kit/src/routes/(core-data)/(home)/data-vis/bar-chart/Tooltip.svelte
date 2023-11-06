<script lang="ts">
  import type { Data, Position } from "./tooltip";

  export let position: Position;
  export let data: Data;
  export let drilldown: any;
  export let remove: (id: string) => void;
  export let arrowStyle = "";
  export let targetElement: SVGElement;

  const runDrilldown = () => drilldown(data.childSubjects, data.display);
</script>

<div class={"tooltip-root flex flex-col gap-3 bg-slate-400 text-black rounded md:p-2 p-[6px] " + position}>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <div class="flex items-baseline gap-2 md:text-lg text-xs">
        <div class="flex flex-col gap-1">
          {#each data.entries as entry}
            <span class="name">{entry.name}</span>
          {/each}
        </div>
        <button class="raw-button flex ml-auto" on:click={() => remove(data.groupId)}><i class="fad fa-times-circle" /></button>
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

  <div class="arrow" style={arrowStyle} />
</div>
