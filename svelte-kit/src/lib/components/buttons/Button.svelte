<script lang="ts">
  import { cssFromPreset } from "./buttonHelpers";

  let className = "";
  export { className as class };

  export let style = "";
  export let disabled = false;
  export let preset = "";
  export let onClick = (evt: any) => {};
</script>

<button class={cssFromPreset(preset, className)} {style} on:click={onClick} {disabled} {...$$restProps}>
  <slot />
</button>
