<script lang="ts">
  import { spring } from "svelte/motion";

  import { tooltip, type Position } from "../tooltip";

  export let drilldown: any;
  export let color: any;
  export let data: any;
  export let height: any;
  export let width: any;
  export let x: any;
  export let totalSvgWidth;
  export let position: Position;
  export let removeBar: (id: string) => void;
  export let noInitialAnimation: boolean;
  export let xxx = false;

  let initialRenderFinished = false;

  const initialValues = noInitialAnimation ? { height, x } : { height: 0, x: totalSvgWidth };
  const barSpring = spring(initialValues, { stiffness: 0.1, damping: 0.4 });

  $: {
    barSpring.set({ height, x }, { hard: noInitialAnimation && !initialRenderFinished }).then(() => {
      initialRenderFinished = true;
    });
  }
</script>

<g use:tooltip={{ position, data, drilldown, remove: removeBar }}>
  <path
    d={`
    M${$barSpring.x},0
    v${$barSpring.height - 5}
    a5,5 0 0 0 ${5},${5}
    h${width - 2 * 5}
    a5,5 0 0 0 ${5},${-5}
    v-${$barSpring.height - 5}
    z
    `}
    fill={xxx ? "url(#inline-gradient-1)" : color}
  />
  <!-- <rect height={Math.max(0, $barSpring.height)} {width} x={$barSpring.x} y={0} fill={xxx ? "url(#inline-gradient-1)" : color} /> -->
</g>
