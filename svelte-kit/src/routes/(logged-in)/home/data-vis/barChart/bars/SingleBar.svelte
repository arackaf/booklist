<script lang="ts">
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";
  import { createPopper } from "@popperjs/core";
  import Tooltip from "../Tooltip.svelte";

  export let color: any;
  export let hoverBar: any;
  export let unHoverBar: any;
  export let data: any;
  export let height: any;
  export let width: any;
  export let x: any;
  export let totalSvgWidth;

  let rootEl: any;
  let tooltipEl: any;

  // let animatedValues = useSpring({
  //   config: config.stiff,
  //   from: { height: 0, width: 0, x: props.totalSvgWidth },
  //   to: { height: props.height, width: props.width, x: props.x }
  // });

  //{...animatedValues}

  let barSpring = spring({ height: 0, x: totalSvgWidth, width }, { stiffness: 0.1, damping: 0.4 });

  $: {
    barSpring.update(state => ({ ...state, height, x, width }));
  }

  onMount(() => {
    console.log({ rootEl });
    const div = document.createElement("div");
    document.body.appendChild(div);

    const junk = new Tooltip({
      target: div
    });
    console.log({ div, x: div.outerHTML });

    setTimeout(() => {
      const popper = createPopper(rootEl, div, {
        placement: "left-start",
        strategy: "absolute"
      });
    }, 2000);

    //popper.forceUpdate();
  });
</script>

<!-- on:mouseover={() => hoverBar(data.groupId)} on:focus={null} on:blur={null} on:mouseout={() => unHoverBar(data.groupId)} -->
<div bind:this={tooltipEl}>
  <span>A</span>
  <span>B</span>
</div>
<g bind:this={rootEl}>
  <rect height={Math.max(0, $barSpring.height)} width={$barSpring.width} x={$barSpring.x} y={0} fill={color} />
</g>
