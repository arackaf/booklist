<script lang="ts">
  import { spring } from "svelte/motion";

  export let data;
  export let height;
  export let width;
  export let x;
  export let hoverBar;
  export let unHoverBar;
  export let totalSvgWidth;

  $: _colors = data.entries.map(e => e.color);
  let colors = [];

  let itemsClamped = {};

  $: {
    let heightUsed = 0;
    let count = _colors.length;
    let currentHeight = $barSpring.height;
    colors = _colors.map((color, i) => {
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
</script>

<g on:mouseover={() => hoverBar(data.groupId)} on:focus={null} on:blur={null} on:mouseout={() => unHoverBar(data.groupId)}>
  {#each colors as c}
    <rect x={$barSpring.x} y={c.y} height={Math.max(c.height, 0)} {width} fill={c.fill} />
  {/each}
</g>
