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

  $: {
    let heightUsed = 0;
    let count = _colors.length;
    let height = $barSpring.height;
    colors = _colors.map((color, i) => {
      let isLast = i + 1 == count;
      let sectionHeight = ~~(height / count);
      let barHeight = isLast ? height - heightUsed : sectionHeight;

      const heightToUse = heightUsed;
      heightUsed += barHeight;

      return { x, y: heightToUse, height: barHeight, fill: color };
    });
  }

  let barSpring = spring({ height: 0, x, width }, { stiffness: 0.1, damping: 0.4 });

  $: {
    barSpring.update(state => ({ ...state, height, x, width }));
  }
</script>

<g on:mouseover={() => hoverBar(data.groupId)} on:mouseout={() => unHoverBar(data.groupId)}>
  {#each colors as c}
    <rect x={$barSpring.x} y={c.y} height={Math.max(c.height, 0)} width={$barSpring.width} fill={c.fill} />
  {/each}
</g>
