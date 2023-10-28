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
  const pieSegments: any[] = pieData.map(segment => {
    const segmentCount = segment.data.entries.length;

    return {
      count: segmentCount,
      chunks: segment.data.entries.map((entry: any, idx: number) => {
        const arcSectionRadius = radius * ((segmentCount - idx) / segmentCount);

        return {
          color: entry.color,
          arc: arcGenerator({
            innerRadius: 0,
            outerRadius: arcSectionRadius,
            startAngle: segment.startAngle,
            endAngle: segment.endAngle
          })
        };
      })
    };
  });
</script>

<svg {width} {height} style="display: inline-block">
  <g transform={`translate(${width / 2}, ${height / 2})`}>
    {#each pieSegments as seg, i}
      {#each seg.chunks as chunk}
        <path d={chunk.arc} fill={chunk.color} />
      {/each}
    {/each}
  </g>
</svg>
