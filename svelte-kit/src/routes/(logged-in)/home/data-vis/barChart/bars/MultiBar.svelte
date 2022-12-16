<script lang="ts">
  import { spring } from "svelte/motion";
  import { tooltip, type Position } from "../tooltip";

  export let drilldown: any;
  export let data: any;
  export let height: any;
  export let width: any;
  export let x: any;
  export let hoverBar: any;
  export let unHoverBar: any;
  export let totalSvgWidth: any;
  export let position: Position;

  let rootEl: any;
  let tooltipEl: any;

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

  let barSpring = spring({ height: 0, x: totalSvgWidth }, { stiffness: 0.1, damping: 0.4 });

  $: {
    itemsClamped = {};
    barSpring.update(state => ({ ...state, height, x }));
  }

  // onMount(() => {
  //   const div = document.createElement("div");
  //   div.classList.add("popper-tooltip");
  //   document.body.appendChild(div);

  //   new Tooltip({
  //     target: div,
  //     props: {
  //       name: "XYZ"
  //     }
  //   });

  //   setTimeout(() => {
  //     const popper = createPopper(rootEl, div, {
  //       placement: "left-start",
  //       strategy: "absolute"
  //     });
  //   }, 500);

  //   rootEl.addEventListener("mouseenter", () => div.classList.add("show"));
  //   rootEl.addEventListener("mouseleave", () => div.classList.remove("show"));
  // });
</script>

<!-- on:mouseover={() => hoverBar(data.groupId)} on:focus={null} on:blur={null} on:mouseout={() => unHoverBar(data.groupId)} -->
<g bind:this={rootEl} use:tooltip={{ position, data, drilldown }}>
  {#each colors as c}
    <rect x={$barSpring.x} y={c.y} height={Math.max(c.height, 0)} {width} fill={c.fill} />
  {/each}
</g>
