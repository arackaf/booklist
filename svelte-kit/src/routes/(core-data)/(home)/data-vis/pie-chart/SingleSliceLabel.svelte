<script lang="ts">
  import { spring } from "svelte/motion";

  export let segment: any;

  export let labelsReady: boolean;

  $: ({ centroid, inflexionPoint, labelPosX, textAnchor, isRightLabel } = segment);

  const springConfig = { stiffness: 0.1, damping: 0.7 };

  const initialLabelValues = {
    centroidX: segment.centroid[0],
    centroidY: segment.centroid[1],
    inflexionPointX: segment.inflexionPoint[0],
    inflexionPointY: segment.inflexionPoint[1],
    labelPosX: segment.labelPosX
  };
  const labelSpring = spring(initialLabelValues, springConfig);

  $: {
    labelSpring.set({
      centroidX: centroid[0],
      centroidY: centroid[1],
      inflexionPointX: inflexionPoint[0],
      inflexionPointY: inflexionPoint[1],
      labelPosX
    });
  }
</script>

{#if labelsReady}
  <g>
    <line
      x1={$labelSpring.centroidX}
      y1={$labelSpring.centroidY}
      x2={$labelSpring.inflexionPointX}
      y2={$labelSpring.inflexionPointY}
      stroke={"black"}
      fill={"black"}
    />
    <line
      x1={$labelSpring.inflexionPointX}
      y1={$labelSpring.inflexionPointY}
      x2={$labelSpring.labelPosX}
      y2={$labelSpring.inflexionPointY}
      stroke={"black"}
      fill={"black"}
    />
    <text
      x={$labelSpring.labelPosX + (isRightLabel ? 2 : -2)}
      y={$labelSpring.inflexionPointY}
      text-anchor={textAnchor}
      dominant-baseline="middle"
      font-size={12}
    >
      {segment.masterLabel}
    </text>
  </g>
{/if}
