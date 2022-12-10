<script lang="ts">
  import { spring } from "svelte/motion";
  import Tick from "./Tick.svelte";

  //let { children, scale, graphWidth, data, scaleX, masterTransform, ...rest } = props;

  export let transform;
  export let data: any[];
  export let scale;
  export let graphWidth;
  export let scaleX;
  export let masterTransform;
  export let masterTransformX;
  export let masterTransformY;

  // const axisTickTransitions = useTransition(data, {
  //   config: config.stiff,
  //   from: { opacity: 0 },
  //   enter: d => ({ opacity: 1, transform: getTranslate(d) }),
  //   update: d => ({ transform: getTranslate(d) }),
  //   leave: { opacity: 0 },
  //   keys: item => item.display
  // });

  //$: dTransform =
  // $: mainAxisTransitions = {
  //   transform: transform, d: `M0.5,6 V0.5 H${props.graphWidth + 0.5} V 6`, masterTransform },
  //   config: config.stiff
  // };

  let axisSpring = spring({ width: graphWidth, masterTransformX, masterTransformY }, { stiffness: 0.1, damping: 0.4 });
  $: axisSpring.update(state => ({ ...state, width: graphWidth, masterTransformX, masterTransformY }));
</script>

<g transform={`translate(${$axisSpring.masterTransformX}, ${$axisSpring.masterTransformY})`}>
  <g font-size="10" {transform}>
    <path fill="none" stroke="black" d="M0.5,6 V0.5 H{$axisSpring.width + 0.5} V 6" />
    {#each data as d (d)}
      <Tick {scaleX} {d} />
    {/each}
  </g>
</g>
