<script lang="ts">
  export let color;
  export let hoverBar;
  export let unHoverBar;
  export let data;
  export let height;
  export let width;
  export let x;
  export let totalSvgWidth;

  // let animatedValues = useSpring({
  //   config: config.stiff,
  //   from: { height: 0, width: 0, x: props.totalSvgWidth },
  //   to: { height: props.height, width: props.width, x: props.x }
  // });

  //{...animatedValues}
</script>

<g onMouseOver={() => hoverBar(data.groupId)} onMouseOut={() => unHoverBar(data.groupId)}>
  <rect {height} {width} {x} y={0} fill={color} />
</g>