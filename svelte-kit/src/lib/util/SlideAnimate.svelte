<script lang="ts">
  import { onMount } from "svelte";
  import { slideAnimate } from "./animationHelpers";

  export let open: boolean;
  export let fade: boolean = true;

  let hydrated = false;
  onMount(() => {
    hydrated = true;
  });
</script>

<div>
  <div use:slideAnimate={{ open, fade }} class:hide={!hydrated} {...$$props}>
    <slot />
  </div>
</div>

<style>
  .hide {
    display: none;
  }
</style>
