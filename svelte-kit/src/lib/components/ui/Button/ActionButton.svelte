<script lang="ts">
  import Button from "./Button.svelte";

  export let type: "primary" | "danger" | "default" = "default";
  export let disabled: boolean = false;
  export let running: boolean;
</script>

<Button class="grid grid-cols-1 grid-rows-1" on:click {type} disabled={disabled || running}>
  <div class="col-start-1 col-end-2 row-start-1 row-end-2" class:invisible={running}>
    <slot />
  </div>
  <div class="col-start-1 col-end-2 row-start-1 row-end-2" class:invisible={!running}>
    <slot name="running">
      <slot />
    </slot>
  </div>
</Button>
