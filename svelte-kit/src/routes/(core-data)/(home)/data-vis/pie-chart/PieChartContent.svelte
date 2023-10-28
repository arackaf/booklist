<script lang="ts">
  import { arc, pie } from "d3-shape";

  export let graphData: any[];

  const diameter = 400;
  const width = diameter;
  const height = diameter;

  const margin = 50;

  const radius = diameter / 2 - margin;

  const pieGenerator = pie().value((d: any) => d.count);

  const pieData: any[] = pieGenerator(graphData);

  const arcGenerator = arc();
  const arcs: any[] = pieData.map(data =>
    arcGenerator({
      innerRadius: 0,
      outerRadius: radius,
      startAngle: data.startAngle,
      endAngle: data.endAngle
    })
  );
</script>

<svg {width} {height} style="display: inline-block">
  <g transform={`translate(${width / 2}, ${height / 2})`}>
    {#each arcs as arc, i}
      <path d={arc} fill={pieData[i].data.entries[0].color} />
    {/each}
  </g>
</svg>
