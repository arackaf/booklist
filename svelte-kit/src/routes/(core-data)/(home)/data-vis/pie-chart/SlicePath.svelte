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

  type Props = {
    segmentChunk: ChunkType;
    color?: string | null;
    sliceSpring: Spring<any>;
  };

  let { segmentChunk, color = null, sliceSpring }: Props = $props();

  const arcGenerator = arc();

  let arcPath = $derived.by(() => {
    return arcGenerator({
      innerRadius: segmentChunk.innerRadius,
      outerRadius: segmentChunk.outerRadius,
      startAngle: $sliceSpring.startAngle,
      endAngle: $sliceSpring.endAngle
    });
  });
</script>

<path d={arcPath} fill={color ?? segmentChunk.color} />
