<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import Button from "./Button.svelte";

  type Props = {
    size?: "default" | "med" | "sm";
    theme?: "primary" | "info" | "success" | "danger" | "default";
    disabled?: boolean;
    running: boolean;
    children: Snippet;
  } & HTMLButtonAttributes;

  let { size = "default", theme = "default", disabled = false, running, class: className = "", children: passedChildren, ...rest }: Props = $props();
</script>

<Button class={"grid grid-cols-1 grid-rows-1 " + className} {size} {theme} disabled={disabled || running} {...rest}>
  {#snippet children()}
    <div class="col-start-1 col-end-2 row-start-1 row-end-2" class:invisible={running}>
      {@render passedChildren()}
    </div>
    <div class="col-start-1 col-end-2 row-start-1 row-end-2" class:invisible={!running}>
      {@render passedChildren()}
    </div>
  {/snippet}
</Button>
