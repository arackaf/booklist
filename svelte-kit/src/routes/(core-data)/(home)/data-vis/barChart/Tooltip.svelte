<script lang="ts">
  import type { Data, Position } from "./tooltip";

  export let position: Position;
  export let data: Data;
  export let drilldown: any;
  export let removeBar: (id: string) => void;

  const runDrilldown = () => drilldown(data.childSubjects, data.display);
</script>

<div class={"tooltip-root flex flex-col gap-3 bg-slate-400 text-black rounded p-2 " + position}>
  <div class="flex items-baseline gap-2 text-lg">
    <span class="name">{data.display}: {data.count} Books</span>
    <button class="raw-button flex" on:click={() => removeBar(data.groupId)}><i class="fad fa-times-circle" /></button>
  </div>

  {#if data.childSubjects?.length}
    <div class="text-base">
      <button on:click={runDrilldown} class="gap-2 raw-button flex gap-1">
        <span class="leading-none text-black">View</span>
        <i class="far fa-chart-bar leading-none text-black" />
      </button>
    </div>
  {/if}

  <div class={"arrow " + position} />
</div>
