<script lang="ts">
  import { tick } from "svelte";

  import GraphSvg from "../svgIcons/GraphSvg.svelte";
  import RemoveSvg from "../svgIcons/RemoveSvg.svelte";

  export let data: any;
  export let srcHeight: any;
  export let srcWidth: any;
  export let srcX: any;
  export let count: any;
  export let index: any;
  export let childSubjects: any;
  export let hovered: any;

  export let drilldown: any;
  export let chartIndex: any;
  export let removeBar: any;

  let tooltipHovered = false;

  $: isShowing = hovered || tooltipHovered;

  const OFFSET_LEFT = 10;
  const CONTENT_X_START = 5;
  const CONTAINER_PADDING = 5;

  let removeSvgStart = 0;

  const display = data?.entries
    .map((e: any) => e.name)
    .sort()
    .join(",");

  let rootEl;
  let contentEl: any;
  let textEl: any;

  let adjust = { x: 0, y: 0 };
  let tooltipContentsBox = { width: 0, height: 0, x: 0, y: 0 };
  $: textAnchorY = srcHeight - CONTAINER_PADDING * 3;

  $: tooltipContainer = {
    x: tooltipContentsBox.x - CONTAINER_PADDING,
    y: tooltipContentsBox.y - CONTAINER_PADDING,
    width: tooltipContentsBox.width + CONTAINER_PADDING * 4,
    height: tooltipContentsBox.height + CONTAINER_PADDING * 3
  };

  $: {
    let reactiveDeps = { isShowing, srcX, display, srcWidth, srcHeight, removeSvgStart };

    const textBBox = textEl?.getBBox();
    if (textBBox && textBBox.width + 30 != removeSvgStart) {
      removeSvgStart = textBBox.width + 30;
    }

    if (isShowing && contentEl) {
      tick().then(() => (tooltipContentsBox = contentEl.getBBox()));
    }
  }

  $: {
    let newX = 0;
    let newY = 0;
    if (tooltipContainer.y + tooltipContainer.height > 0) {
      newY = -1 * (tooltipContainer.height - -1 * tooltipContainer.y) - 2;
    }

    if (index / count > 0.5 && tooltipContainer.width > srcWidth) {
      newX = -1 * (tooltipContainer.width - srcWidth + 2 * CONTAINER_PADDING);
    }

    adjust = { x: newX, y: newY };
  }

  const doRemoveBar = () => removeBar(data.groupId);
</script>

{#if isShowing}
  <g
    on:mouseover={() => (tooltipHovered = true)}
    on:mouseleave={() => (tooltipHovered = false)}
    on:focus={() => {}}
    class="svg-tooltip"
    bind:this={rootEl}
    transform={`scale(1, -1) translate(${srcX + OFFSET_LEFT}, 0) translate(${adjust.x}, ${adjust.y})`}
  >
    <rect class="content" rx="5" {...tooltipContainer} fill="black" />
    <g style="fill: white" bind:this={contentEl}>
      <text bind:this={textEl} style="font-size: 20px" dominant-baseline="hanging" x={CONTENT_X_START} y={-1 * textAnchorY}>
        {display}:
        {data.count}
      </text>
      <g on:click={doRemoveBar} class="svgPointer" on:keypress={() => {}}>
        <rect x={CONTENT_X_START + removeSvgStart} y={-1 * textAnchorY - 5} width="20" height="20" fill="black" />

        <RemoveSvg x={CONTENT_X_START + removeSvgStart} y={-1 * textAnchorY - 5} width="20" />
      </g>
      {#if childSubjects.length}
        <g on:click={() => drilldown(chartIndex, childSubjects, display)} on:keypress={() => {}} class="svgPointer">
          <rect x={CONTENT_X_START - 5} y={-1 * textAnchorY + 30} width="30" height="20" fill="black" />
          <GraphSvg x={CONTENT_X_START} y={-1 * textAnchorY + 30} width="20" />
        </g>
      {:else}
        <rect x={CONTENT_X_START - 5} y={-1 * textAnchorY + 30} width="1" height="5" fill="black" />
      {/if}
    </g>
  </g>
{/if}
