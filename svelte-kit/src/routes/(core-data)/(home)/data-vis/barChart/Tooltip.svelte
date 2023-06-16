<script lang="ts">
  import type { Data, Position } from "./tooltip";

  export let position: Position;
  export let data: Data;
  export let drilldown: any;
  export let removeBar: (id: string) => void;

  const runDrilldown = () => drilldown(data.childSubjects, data.display);
</script>

<div class={"tooltip-root " + position}>
  <div class="content">
    <span class="name">{data.display}: {data.count}</span>
    <button class="raw-button flex" on:click={() => removeBar(data.groupId)}><i class="fad fa-times-circle" /></button>
  </div>

  {#if data.childSubjects?.length}
    <br />

    <button on:click={runDrilldown} class="gap-2 raw-button text-lg">
      <span class="leading-none">View</span>
      <i class="far fa-chart-bar leading-none" />
    </button>
  {/if}

  <div class={"arrow " + position} />
</div>
