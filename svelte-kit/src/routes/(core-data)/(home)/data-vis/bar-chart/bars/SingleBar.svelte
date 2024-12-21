<script lang="ts">
  import { spring } from "svelte/motion";

  import type { Position } from "../../tooltip/tooltipUtils";
  import { getContext } from "svelte";
  import type { createTooltipState } from "../../tooltip/tooltipState.svelte";
  import BarPath from "./BarPath.svelte";

  type Props = {
    drilldown: any;
    color: string;
    data: any;
    height: number;
    width: number;
    x: number;
    totalSvgWidth: number;
    position: Position;
    removeBar: (id: string) => void;
    noInitialAnimation: boolean;
  };

  let { drilldown, color, data, height, width, x, totalSvgWidth, position, removeBar, noInitialAnimation }: Props = $props();

  let g = $state<SVGElement>(null as any);
  const tooltipState = getContext("tooltip-state") as ReturnType<typeof createTooltipState>;
  let initialRenderFinished = $state(false);

  function mouseOver() {
    tooltipState.onHover(g, { position, data, drilldown, remove: removeBar });
  }

  function mouseOut() {
    tooltipState.onMouseLeave();
  }

  const initialValues = noInitialAnimation ? { height, x } : { height: 0, x: totalSvgWidth };
  const barSpring = spring(initialValues, { stiffness: 0.1, damping: 0.4 });

  $effect(() => {
    barSpring.set({ height, x }, { hard: noInitialAnimation && !initialRenderFinished }).then(() => {
      initialRenderFinished = true;
    });
  });
</script>

<g role="contentinfo" onmouseover={mouseOver} onmouseout={mouseOut} bind:this={g} onfocus={() => {}} onblur={() => {}}>
  <BarPath x={$barSpring.x} height={$barSpring.height} {width} fill={color} />
</g>
