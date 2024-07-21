<script lang="ts">
  import { spring, type Spring } from "svelte/motion";
  import { arc } from "d3-shape";
  import PieSliceColor from "./PieSliceColor.svelte";

  type ChunkType = {
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    color: string;
  };

  export let centroid: [number, number];
  export let segmentChunk: ChunkType;
  export let color: string | string[];
  let colorToUse: string;

  export let sliceSpring: Spring<any>;

  const arcGenerator = arc();

  $: arcPath = arcGenerator({
    innerRadius: segmentChunk.innerRadius,
    outerRadius: segmentChunk.outerRadius,
    startAngle: $sliceSpring.startAngle,
    endAngle: $sliceSpring.endAngle
  });
</script>

<path d={arcPath} fill={colorToUse} />
<PieSliceColor {color} bind:colorValue={colorToUse} center={[0, 0]} arcCenter={centroid} />
