<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import Button from "./Button.svelte";

  type Props = {
    size: "default" | "med" | "sm";
    theme?: "primary" | "info" | "success" | "danger" | "default";
    disabled?: boolean;
    running: boolean;
  } & HTMLButtonAttributes;

  let { size, theme = "default", disabled = false, running, class: className = "", ...rest }: Props = $props();
</script>

<Button on:click class={"grid grid-cols-1 grid-rows-1 " + className} {size} {theme} disabled={disabled || running} {...rest}>
  <div class="col-start-1 col-end-2 row-start-1 row-end-2" class:invisible={running}>
    <slot />
  </div>
  <div class="col-start-1 col-end-2 row-start-1 row-end-2" class:invisible={!running}>
    <slot name="running">
      <slot />
    </slot>
  </div>
</Button>
