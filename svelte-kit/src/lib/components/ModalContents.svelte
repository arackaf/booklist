<script lang="ts">
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";

  let hasInitialSize = false;
  const DIMENSIONS_SPRING = { stiffness: 0.2, damping: 0.6, precision: 0.01 };

  let innerContent: HTMLElement;
  const { sizingSpring, sync } = getDimensionsSpring();

  function getDimensionsSpring() {
    const sizingSpring = spring({ height: 0, width: 0 }, { ...DIMENSIONS_SPRING, precision: 0.5 });

    const getConfig = () => {
      let immediate = !hasInitialSize;
      return immediate ? { hard: true } : {};
    };

    const sync = ({ height, width }) => {
      sizingSpring.set({ height, width }, getConfig());
    };

    return { sync, sizingSpring };
  }

  const ro = new ResizeObserver(() => {
    sync({ height: innerContent.offsetHeight, width: innerContent.offsetWidth });
    if (!hasInitialSize) {
      hasInitialSize = true;
    }
  });

  $: animatedHeight = hasInitialSize ? $sizingSpring.height + "px" : "";
  $: dimensionStyles = animatedHeight ? "height: " + animatedHeight : "";

  onMount(() => {
    ro.observe(innerContent);

    return () => {
      ro.unobserve(innerContent);
    };
  });
</script>

<div style={dimensionStyles} class="overflow-hidden">
  <div bind:this={innerContent}>
    <slot />
  </div>
</div>
