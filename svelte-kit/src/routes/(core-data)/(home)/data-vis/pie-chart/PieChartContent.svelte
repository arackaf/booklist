<script lang="ts">
  import { arc, pie } from "d3-shape";
  import { tooltip } from "../bar-chart/tooltip";

  export let graphData: any[];

  const INFLEXION_PADDING = 50; // space between donut and label inflexion point

  const diameter = 500;
  const width = diameter;
  const height = diameter;

  const margin = 0;

  const radius = diameter / 2 - margin;

  const pieGenerator = pie().value((d: any) => d.count);

  const pieData: any[] = pieGenerator(graphData);

  const arcGenerator = arc();
  const pieSegments: any[] = pieData.map(segment => {
    const segmentCount = segment.data.entries.length;
    const masterArc = {
      innerRadius: 0,
      outerRadius: radius,
      startAngle: segment.startAngle,
      endAngle: segment.endAngle
    };
    const centroid = arcGenerator.centroid(masterArc);
    const tooltipAnchor = arcGenerator.centroid({ ...masterArc, innerRadius: radius });

    const inflexionInfo = {
      innerRadius: radius + INFLEXION_PADDING,
      outerRadius: radius + INFLEXION_PADDING,
      startAngle: segment.startAngle,
      endAngle: segment.endAngle
    };

    const inflexionPoint = arcGenerator.centroid(inflexionInfo);

    const isRightLabel = inflexionPoint[0] > 0;
    const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? "start" : "end";
    const masterLabel = segment.data.entries.map((e: any) => e.name).join(", ") + " (" + segment.value + ")";

    return {
      data: segment.data,
      centroid,
      tooltipAnchor,
      inflexionPoint,
      labelPosX,
      textAnchor,
      masterLabel,
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

  let mainArc: SVGElement;

  //console.log({ pieSegments });
</script>

<div class="flex py-24">
  <svg {width} {height} style="display: inline-block; overflow: visible; margin-left: auto; margin-right: auto;">
    <g transform={`translate(${width / 2}, ${height / 2})`}>
      {#each pieSegments as seg, i}
        {#each seg.chunks as chunk}
          {#if i === 0}
            <path bind:this={mainArc} d={chunk.arc} fill={chunk.color} />
          {:else}
            <path d={chunk.arc} fill={chunk.color} />
          {/if}
        {/each}
        <circle cx={seg.centroid[0]} cy={seg.centroid[1]} r={2} />
        <line x1={seg.centroid[0]} y1={seg.centroid[1]} x2={seg.inflexionPoint[0]} y2={seg.inflexionPoint[1]} stroke={"black"} fill={"black"} />
        <line x1={seg.inflexionPoint[0]} y1={seg.inflexionPoint[1]} x2={seg.labelPosX} y2={seg.inflexionPoint[1]} stroke={"black"} fill={"black"} />
        <text
          x={seg.labelPosX + (seg.isRightLabel ? 2 : -2)}
          y={seg.inflexionPoint[1]}
          text-anchor={seg.textAnchor}
          dominant-baseline="middle"
          font-size={14}
        >
          {seg.masterLabel}
        </text>
        <circle
          data-style="visibility: hidden"
          use:tooltip={{ position: "right", data: seg.data, hoverTarget: mainArc, drilldown: () => {}, removeBar: () => {} }}
          cx={seg.tooltipAnchor[0]}
          cy={seg.tooltipAnchor[1]}
          r={2}
        />
      {/each}
    </g>
  </svg>
</div>
