<script lang="ts">
  import { arc, pie } from "d3-shape";
  import SingleSlice from "./SingleSlice.svelte";

  export let showingData: any[];
  export let drilldown: any;
  export let chartIndex: any;
  export let removeSlice: (id: any) => void;

  const noInitialAnimation = chartIndex === 0;

  const scrollInitial = (el: any) => {
    el && chartIndex > 0 && el.scrollIntoView({ behavior: "smooth" });
  };

  const diameter = 500;
  const width = diameter;
  const height = diameter;
  const margin = 0;
  const radius = diameter / 2 - margin;

  const pieGenerator = pie().value((d: any) => d.count);

  $: pieData = pieGenerator(showingData) as any[];

  $: pieSegments = pieData.map(segment => {
    const segmentCount = segment.data.entries.length;

    const masterLabel = segment.data.entries.map((e: any) => e.name).join(", ") + " (" + segment.value + ")";

    return {
      startAngle: segment.startAngle,
      endAngle: segment.endAngle,
      data: segment.data,
      masterLabel,
      count: segmentCount,
      chunks: segment.data.entries.map((entry: any, idx: number) => {
        const arcSectionRadius = radius * ((segmentCount - idx) / segmentCount);

        return {
          color: entry.color,
          innerRadius: 0,
          outerRadius: arcSectionRadius,
          startAngle: segment.startAngle,
          endAngle: segment.endAngle
        };
      })
    };
  }) as any[];

  let labelsReady = noInitialAnimation;
  const onLabelsReady = () => {
    setTimeout(() => {
      labelsReady = true;
    }, 200);
  };
</script>

<div use:scrollInitial class="flex py-24">
  <svg {width} {height} style="display: inline-block; overflow: visible; margin-left: auto; margin-right: auto;">
    <g transform={`translate(${width / 2}, ${height / 2})`}>
      {#each pieSegments as seg (seg.data.groupId)}
        <SingleSlice {radius} {removeSlice} {labelsReady} {onLabelsReady} {noInitialAnimation} segment={seg} {drilldown} />
      {/each}
    </g>
  </svg>
</div>
