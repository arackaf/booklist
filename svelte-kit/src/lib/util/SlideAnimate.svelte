<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { slideAnimate } from "./animationHelpers.svelte";

  type Props = {
    open: boolean;
    fade?: boolean;
    stiffDown?: boolean;
    children: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { open, fade = true, stiffDown = false, children, ...rest }: Props = $props();

  let hydrated = $state(false);

  onMount(() => {
    hydrated = true;
  });
</script>

<div>
  <div use:slideAnimate={{ open, fade, stiffDown }} class:hidden={!hydrated} {...rest}>
    {@render children()}
  </div>
</div>
