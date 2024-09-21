<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { slideAnimate } from "./animationHelpers";

  type Props = {
    open: boolean;
    fade?: boolean;
    stiffDown?: boolean;
  } & HTMLAttributes<HTMLDivElement>;

  let { open, fade = true, stiffDown = false, ...rest }: Props = $props();

  let hydrated = $state(false);

  onMount(() => {
    hydrated = true;
  });
</script>

<div>
  <div use:slideAnimate={{ open, fade, stiffDown }} class:hidden={!hydrated} {...rest}>
    <slot />
  </div>
</div>
