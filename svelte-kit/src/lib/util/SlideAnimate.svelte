<script lang="ts">
  import { onMount } from "svelte";
  import { slideAnimate } from "./animationHelpers";

  export let open: boolean;
  export let fade: boolean = true;
  export let stiffDown: boolean = false;

  let hydrated = false;
  onMount(() => {
    hydrated = true;
  });
</script>

<div>
  <div use:slideAnimate={{ open, fade, stiffDown }} class:hide={!hydrated} {...$$props}>
    <slot />
  </div>
</div>

<style>
  .hide {
    display: none;
  }
</style>
