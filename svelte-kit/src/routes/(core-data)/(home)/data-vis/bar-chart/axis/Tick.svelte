<script lang="ts">
  import { spring } from "svelte/motion";

  export let d: any;
  export let scaleX: any;

  const getTranslateX = (d: any, scaleX: any) => {
    let x = scaleX(d.display);
    let width = scaleX.bandwidth();
    let translateX = x + width / 2;

    return translateX;
  };

  let axisSpring = spring({ translateX: getTranslateX(d, scaleX) }, { stiffness: 0.1, damping: 0.4 });
  $: axisSpring.set({ translateX: getTranslateX(d, scaleX) });

  $: translate = `translate(${$axisSpring.translateX}, 0)`;
</script>

<g style="opacity: 1" transform={translate}>
  <g transform="scale(1, -1)">
    <line stroke="#000" y1="0" y2="6" x1="0" x2="0" />
    <text class="text-[1em]" fill="#000" style="text-anchor: end" transform="translate(0, 10) rotate(300)">{d.display}</text>
  </g>
</g>
