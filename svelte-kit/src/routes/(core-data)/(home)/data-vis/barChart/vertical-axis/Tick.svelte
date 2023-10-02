<script lang="ts">
  import { spring } from "svelte/motion";

  export let d: any;
  export let scale: any;

  const getTranslateY = (d: any, scale: any) => {
    return scale(d);
  };

  let axisSpring = spring({ translateY: getTranslateY(d, scale) }, { stiffness: 0.1, damping: 0.4 });
  $: axisSpring.set({ translateY: getTranslateY(d, scale) });

  $: translate = `translate(0, ${$axisSpring.translateY})`;
</script>

<g style="opacity: 1" transform={translate}>
  <line stroke="#000" y1="0" y2="6" x1="0" x2="0" />
  <text class="text-[1em]" fill="#000" style="text-anchor: end" data-transform="translate(0, 10) rotate(300)">{d}</text>
</g>
