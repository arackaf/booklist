<script lang="ts">
  //let { children, scale, graphWidth, data, scaleX, masterTransform, ...rest } = props;

  export let transform;
  export let data: any[];
  export let scale;
  export let graphWidth;
  export let scaleX;
  export let masterTransform;

  const getTranslate = d => {
    let x = scaleX(d.display);
    let width = scaleX.bandwidth();
    let translateX = x + width / 2;

    return `translate(${translateX}, 0)`;
  };

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
</script>

<g transform={masterTransform}>
  <g font-size="10" {transform}>
    <path fill="none" stroke="black" d="M0.5,6 V0.5 H{graphWidth + 0.5} V 6" />
    {#each data as d}
      <g style="opacity: 1" transform={getTranslate(d)}>
        <line stroke="#000" y1="0" y2="6" x1="0" x2="0" />
        <text fill="#000" style="text-anchor: end" transform="translate(0, 10) rotate(300)">{d.display}</text>
      </g>
      );
    {/each}
  </g>
</g>
