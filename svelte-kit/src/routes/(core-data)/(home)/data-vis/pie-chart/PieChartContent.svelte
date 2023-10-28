<script lang="ts">
  import { arc, pie } from "d3-shape";

  export let graphData: any[];

  const diameter = 400;
  const width = diameter;
  const height = diameter;

  const margin = 50;

  const radius = diameter / 2 - margin;

  console.log({ graphData });

  const pieGenerator = pie().value((d: any) => d.entries.length);

  console.log({ pieGenerator });

  const pieData = pieGenerator(graphData);

  console.log({ pieData });

  const arcGenerator = arc();
  const arcs = pieData.map(data =>
    arcGenerator({
      innerRadius: 0,
      outerRadius: radius,
      startAngle: data.startAngle,
      endAngle: data.endAngle
    })
  );

  console.log({ arcs });

  const colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"];
</script>

<svg {width} {height} style="display: inline-block">
  <g transform={`translate(${width / 2}, ${height / 2})`}>
    {#each arcs as arc, i}
      <path d={arc} fill={colors[i % colors.length]} />
    {/each}
  </g>
</svg>
