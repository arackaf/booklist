<script lang="ts">
  export let data;
  export let height;
  export let width;
  export let x;
  export let totalSvgWidth;
  export let hoverBar;
  export let unHoverBar;

  $: _colors = data.entries.map(e => e.color);
  let colors = [];

  $: {
    let heightUsed = 0;
    let count = _colors.length;
    colors = _colors.map((color, i) => {
      let isLast = i + 1 == count;
      let sectionHeight = ~~(height / count);
      let barHeight = isLast ? height - heightUsed : sectionHeight;

      const heightToUse = heightUsed;
      heightUsed += barHeight;

      return { x, y: heightToUse, height: barHeight, width, fill: color };
    });
  }
</script>

<g on:mouseover={() => hoverBar(data.groupId)} on:mouseout={() => unHoverBar(data.groupId)}>
  {#each colors as c}
    <rect {x} y={c.y} height={c.height} width={c.width} fill={c.fill} />
  {/each}
</g>
