<script lang="ts">
  import { spring } from "svelte/motion";
  import type { Position } from "../../tooltip/tooltipUtils";
  import { getContext } from "svelte";
  import type { createTooltipState } from "../../tooltip/tooltipState";
  import BarPath from "./BarPath.svelte";

  type Props = {
    drilldown: any;
    data: any;
    height: number;
    width: number;
    x: number;
    totalSvgWidth: number;
    position: Position;
    removeBar: (id: string) => void;
    noInitialAnimation: boolean;
  };

  let { drilldown, data, height, width, x, totalSvgWidth, position, removeBar, noInitialAnimation }: Props = $props();

  let g = $state<SVGElement>(null as any);
  let initialRenderFinished = $state(false);
  const tooltipState = getContext("tooltip-state") as ReturnType<typeof createTooltipState>;

  const initialValues = noInitialAnimation ? { height, x } : { height: 0, x: totalSvgWidth };
  const barSpring = spring(initialValues, { stiffness: 0.1, damping: 0.4 });

  $effect(() => {
    barSpring.set({ height, x }, { hard: noInitialAnimation && !initialRenderFinished }).then(() => {
      initialRenderFinished = true;
    });
  });

  function mouseOver() {
    tooltipState.onHover(g, { position, data, drilldown, remove: removeBar });
  }

  function mouseOut() {
    tooltipState.onMouseLeave();
  }

  let gradientId = $derived(data.groupId.replace(/,/g, "-"));
</script>

<g role="contentinfo" onmouseover={mouseOver} onmouseout={mouseOut} bind:this={g} onfocus={() => {}} onblur={() => {}}>
  <BarPath x={$barSpring.x} height={$barSpring.height} {width} fill={`url(#${gradientId})`} />
</g>
