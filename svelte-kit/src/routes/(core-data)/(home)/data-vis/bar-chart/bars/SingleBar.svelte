<script lang="ts">
  import { spring } from "svelte/motion";

  import { tooltip, type Position } from "../tooltip";
  import BarTooltip from "./BarTooltip.svelte";

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

  let initialRenderFinished = false;

  const initialValues = noInitialAnimation ? { height, x } : { height: 0, x: totalSvgWidth };
  const barSpring = spring(initialValues, { stiffness: 0.1, damping: 0.4 });

  $: {
    barSpring.set({ height, x }, { hard: noInitialAnimation && !initialRenderFinished }).then(() => {
      initialRenderFinished = true;
    });
  }
</script>

<g use:tooltip={{ position, data, drilldown, remove: removeBar, TooltipComponent: BarTooltip }}>
  <rect height={Math.max(0, $barSpring.height)} {width} x={$barSpring.x} y={0} fill={color} />
</g>
