<script lang="ts">
  import type { Data, Position } from "./tooltip";

  export let position: Position;
  export let data: Data;
  export let drilldown: any;
  export let removeBar: (id: string) => void;

  const runDrilldown = () => drilldown(data.childSubjects, data.display);
</script>

<div class={"tooltip-root flex flex-col gap-3 bg-slate-400 text-black rounded p-2 " + position}>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <div class="flex items-baseline gap-2 md:text-lg text-xs">
        <span class="name">{data.display}</span>
        <button class="raw-button flex" on:click={() => removeBar(data.groupId)}><i class="fad fa-times-circle" /></button>
      </div>
      <hr class="border-slate-600 m-0" />
    </div>
    <div class="md:text-base text-xs">
      <span>{data.count} Books</span>
    </div>
    {#if data.childSubjects?.length}
      <div class="md:text-base text-xs">
        <button on:click={runDrilldown} class="raw-button flex gap-2">
          <span class="leading-none text-black">View</span>
          <i class="far fa-chart-bar leading-none text-black" />
        </button>
      </div>
    {/if}
  </div>

  <div class={"arrow " + position} />
</div>
