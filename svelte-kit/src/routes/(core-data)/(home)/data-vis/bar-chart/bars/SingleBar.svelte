<script lang="ts">
  import { spring } from "svelte/motion";

  import { type Position } from "../../tooltip/tooltipUtils";
  import { getContext } from "svelte";
  import type { createTooltipState } from "../../tooltip/tooltipState";

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

  let g: SVGElement;

  const tooltipState = getContext("tooltip-state") as ReturnType<typeof createTooltipState>;

  function mouseOver() {
    tooltipState.onHover(g, { position, data, drilldown, remove: removeBar });
  }

  function mouseOut() {
    tooltipState.onMouseLeave();
  }

  let initialRenderFinished = false;

  const initialValues = noInitialAnimation ? { height, x } : { height: 0, x: totalSvgWidth };
  const barSpring = spring(initialValues, { stiffness: 0.1, damping: 0.4 });

  $: {
    barSpring.set({ height, x }, { hard: noInitialAnimation && !initialRenderFinished }).then(() => {
      initialRenderFinished = true;
    });
  }
</script>

<g role="contentinfo" on:mouseover={mouseOver} on:mouseout={mouseOut} bind:this={g}>
  <rect height={Math.max(0, $barSpring.height)} {width} x={$barSpring.x} y={0} fill={color} />
</g>
