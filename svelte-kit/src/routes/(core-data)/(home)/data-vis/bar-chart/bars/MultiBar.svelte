<script lang="ts">
  import { spring } from "svelte/motion";
  import { type Position } from "../../tooltip/tooltipUtils";
  import { getContext } from "svelte";
  import type { createTooltipState } from "../../tooltip/tooltipState";
  import BarPath from "./BarPath.svelte";

  export let drilldown: any;
  export let data: any;
  export let height: any;
  export let width: any;
  export let x: any;
  export let totalSvgWidth: any;
  export let position: Position;
  export let removeBar: (id: string) => void;

  export let noInitialAnimation: boolean;

  let g: SVGElement;
  let initialRenderFinished = false;
  const tooltipState = getContext("tooltip-state") as ReturnType<typeof createTooltipState>;

  $: _colors = data.entries.map((e: any) => e.color);
  let colors: any[] = [];

  let itemsClamped: any = {};

  $: {
    let heightUsed = 0;
    let count = _colors.length;
    let currentHeight = $barSpring.height;
    colors = _colors.map((color: any, i: any) => {
      let isLast = i + 1 == count;
      let sectionHeight = ~~(currentHeight / count);
      let finalSectionHeight = ~~(height / count);
      let barHeight = isLast ? currentHeight - heightUsed : sectionHeight;

      if (!isLast && barHeight > finalSectionHeight) {
        itemsClamped[i] = true;
      }

      if (itemsClamped[i]) {
        barHeight = finalSectionHeight;
      }

      const sectionVerticalStartingPoint = heightUsed;
      heightUsed += barHeight;

      return { x, y: sectionVerticalStartingPoint, height: barHeight, fill: color };
    });
  }

  const initialValues = noInitialAnimation ? { height, x } : { height: 0, x: totalSvgWidth };
  let barSpring = spring(initialValues, { stiffness: 0.1, damping: 0.4 });

  $: {
    itemsClamped = {};
    barSpring.set({ height, x }, { hard: noInitialAnimation && !initialRenderFinished }).then(() => {
      initialRenderFinished = true;
    });
  }

  function mouseOver() {
    tooltipState.onHover(g, { position, data, drilldown, remove: removeBar });
  }

  function mouseOut() {
    tooltipState.onMouseLeave();
  }

  $: gradientId = data.groupId.replace(/,/g, "-");
</script>

<g role="contentinfo" on:mouseover={mouseOver} on:mouseout={mouseOut} bind:this={g}>
  <BarPath x={$barSpring.x} height={$barSpring.height} {width} fill={`url(#${gradientId})`} />
</g>
