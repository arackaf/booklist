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

  // let animatedGOffsetValues = useSpring({
  //   config: config.stiff,
  //   to: { transform }
  // });
</script>

<g {transform}>
  {#each showingData.filter(d => !excluding[d.groupId]) as d, i (d)}
    <Bar data={d} x={scaleX(d.display)} width={scaleX.bandwidth()} height={dataScale(d.count)} {totalSvgWidth} {hoverBar} {unHoverBar} />
  {/each}
</g>
