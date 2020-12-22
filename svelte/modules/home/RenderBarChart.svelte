<script lang="ts">
  import Bar from "./Bar.svelte";

  export let showingData: any[];
  export let excluding;
  export let scaleX;
  export let dataScale;
  export let totalSvgWidth;
  export let hoverBar;
  export let unHoverBar;
  export let transform;

  // let animatedGOffsetValues = useSpring({
  //   config: config.stiff,
  //   to: { transform }
  // });
</script>

<g {transform}>
  {#each showingData.filter(d => !excluding[d.groupId]) as d, i (d)}
    <Bar
      data={d}
      count={showingData.length}
      x={scaleX(d.display)}
      width={scaleX.bandwidth()}
      height={dataScale(d.count)}
      {totalSvgWidth}
      {hoverBar}
      {unHoverBar}
    />
  {/each}
</g>
