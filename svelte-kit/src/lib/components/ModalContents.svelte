<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { spring } from "svelte/motion";

  type Props = {
    children: Snippet;
  };
  let { children }: Props = $props();

  let hasInitialSize = $state(false);
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

  let animatedHeight = $derived(hasInitialSize ? $sizingSpring.height + "px" : "");
  let dimensionStyles = $derived(animatedHeight ? "height: " + animatedHeight : "");

  onMount(() => {
    ro.observe(innerContent);

    return () => {
      ro.unobserve(innerContent);
    };
  });
</script>

<div style={dimensionStyles} class="overflow-hidden text-base text-neutral-900">
  <div bind:this={innerContent} class="p-1">
    {@render children()}
  </div>
</div>
