<script lang="ts">
  import { spring } from "svelte/motion";

  import { tooltip, type Position } from "../tooltip";
  import { getContext } from "svelte";
  import type { createTooltipState } from "../../tooltipState";
  import { positionTooltip } from "../tooltipPositioner";

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
    let bound = g.getBoundingClientRect();
    // console.log({ position, bound, x });
    const tooltipPosition = positionTooltip(bound, position);
    tooltipState.show(tooltipPosition, { position, data, drilldown, remove: removeBar });
  }

  function mouseOut() {
    tooltipState.hide();
  }

  let initialRenderFinished = false;

  const initialValues = noInitialAnimation ? { height, x } : { height: 0, x: totalSvgWidth };
  const barSpring = spring(initialValues, { stiffness: 0.1, damping: 0.4 });

  $: {
    barSpring.set({ height, x }, { hard: noInitialAnimation && !initialRenderFinished }).then(() => {
      initialRenderFinished = true;
    });
  }
  //use:tooltip={{ position, data, drilldown, remove: removeBar }}
</script>

<g role="contentinfo" on:mouseover={mouseOver} on:mouseout={mouseOut} bind:this={g}>
  <rect height={Math.max(0, $barSpring.height)} {width} x={$barSpring.x} y={0} fill={color} />
</g>
