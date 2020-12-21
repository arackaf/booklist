<script lang="ts">
  export let data;
  export let count;
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
    colors = _colors.map((color, i) => {
      let isLast = i + 1 == count;
      let sectionHeight = ~~(height / count);
      let barHeight = isLast ? height - heightUsed : sectionHeight;

      const heightToUse = heightUsed;
      heightUsed += barHeight;

      return { x, y: heightToUse, height: barHeight, width, fill: color };
      // return {
      //   config: config.stiff,
      //   from: { x: props.totalSvgWidth, y: 0, height: 0, width: 0, fill: color },
      // };
    });
  }
  // const springs = useSprings(
  //   count,
  //   colors.map((color, i) => {
  //     let isLast = i + 1 == count;
  //     let sectionHeight = ~~(height / count);
  //     let barHeight = isLast ? height - heightUsed : sectionHeight;

  //     const heightToUse = heightUsed;
  //     heightUsed += barHeight;

  //     return {
  //       config: config.stiff,
  //       from: { x: props.totalSvgWidth, y: 0, height: 0, width: 0, fill: color },
  //       to: { x: props.x, y: heightToUse, height: barHeight, width: props.width, fill: color }
  //     };
  //   })
</script>

<g on:mouseover={() => hoverBar(data.groupId)} on:mouseout={() => unHoverBar(data.groupId)}>
  {#each colors as c}
    <rect {x} y={c.heightToUse} height={c.barHeight} width={c.width} fill={c.fill} />
  {/each}
</g>
