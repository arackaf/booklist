<script lang="ts">
  import Bar from "../bars/Bar.svelte";

  export let showingData: any[];
  export let excluding: any;
  export let scaleX: any;
  export let dataScale: any;
  export let totalSvgWidth: any;
  export let hoverBar: any;
  export let unHoverBar: any;
  export let transform: any;
  export let drilldown: any;

  // let animatedGOffsetValues = useSpring({
  //   config: config.stiff,
  //   to: { transform }
  // });
  $: nonExcludedGroups = showingData.filter(d => !excluding[d.groupId]);
</script>

<g {transform}>
  {#each nonExcludedGroups as d, i (d)}
    <Bar
      barCount={nonExcludedGroups.length}
      data={d}
      x={scaleX(d.display)}
      width={scaleX.bandwidth()}
      index={i}
      height={dataScale(d.count)}
      {totalSvgWidth}
      {hoverBar}
      {unHoverBar}
      {drilldown}
    />
  {/each}
</g>
