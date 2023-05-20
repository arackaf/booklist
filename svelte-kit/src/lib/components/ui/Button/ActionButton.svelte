<script lang="ts">
  import Button from "./Button.svelte";

  export let theme: "primary" | "danger" | "default" = "default";
  export let disabled: boolean = false;
  export let running: boolean;
</script>

<Button class="grid grid-cols-1 grid-rows-1" on:click {theme} disabled={disabled || running} {...$$restProps}>
  <div class="col-start-1 col-end-2 row-start-1 row-end-2" class:invisible={running}>
    <slot />
  </div>
  <div class="col-start-1 col-end-2 row-start-1 row-end-2" class:invisible={!running}>
    <slot name="running">
      <slot />
    </slot>
  </div>
</Button>
