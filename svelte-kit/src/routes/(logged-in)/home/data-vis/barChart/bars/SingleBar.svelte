<script lang="ts">
  import { spring } from "svelte/motion";

  export let color: any;
  export let hoverBar: any;
  export let unHoverBar: any;
  export let data: any;
  export let height: any;
  export let width: any;
  export let x: any;
  export let totalSvgWidth;

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
</script>

<g on:mouseover={() => hoverBar(data.groupId)} on:focus={null} on:blur={null} on:mouseout={() => unHoverBar(data.groupId)}>
  <rect height={Math.max(0, $barSpring.height)} width={$barSpring.width} x={$barSpring.x} y={0} fill={color} />
</g>
