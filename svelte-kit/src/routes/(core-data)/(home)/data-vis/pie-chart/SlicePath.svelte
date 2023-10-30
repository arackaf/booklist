<script lang="ts">
  import { spring } from "svelte/motion";
  import { arc } from "d3-shape";

  type ChunkType = {
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    color: string;
  };
  export let segmentChunk: ChunkType;
  export let animate = true;

  let initialAnimationDoneCalled = false;
  export let initialAnimationDone: () => void;

  const arcGenerator = arc();

  const springConfig = { stiffness: 0.1, damping: 0.7 };

  const initialSliceAngles = { startAngle: segmentChunk.startAngle, endAngle: animate ? segmentChunk.startAngle : segmentChunk.endAngle };
  const sliceSpring = spring(initialSliceAngles, springConfig);

  $: {
    sliceSpring
      .set({
        startAngle: segmentChunk.startAngle,
        endAngle: segmentChunk.endAngle
      })
      .then(() => {
        if (!initialAnimationDoneCalled) {
          initialAnimationDone();
        }
        initialAnimationDoneCalled = true;
      });
  }

  $: arcPath = arcGenerator({
    innerRadius: segmentChunk.innerRadius,
    outerRadius: segmentChunk.outerRadius,
    startAngle: $sliceSpring.startAngle,
    endAngle: $sliceSpring.endAngle
  });
</script>

<path d={arcPath} fill={segmentChunk.color} />
