<script lang="ts">
  import { spring, type Spring } from "svelte/motion";
  import { arc } from "d3-shape";

  type ChunkType = {
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    color: string;
  };
  export let segmentChunk: ChunkType;
  export let color: string | null = null;

  export let sliceSpring: Spring<any>;

  const arcGenerator = arc();

  $: arcPath = arcGenerator({
    innerRadius: segmentChunk.innerRadius,
    outerRadius: segmentChunk.outerRadius,
    startAngle: $sliceSpring.startAngle,
    endAngle: $sliceSpring.endAngle
  });
</script>

<path d={arcPath} fill={color ?? segmentChunk.color} />
