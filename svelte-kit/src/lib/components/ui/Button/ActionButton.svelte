<script lang="ts">
  import Button from "./Button.svelte";

  let className = "";
  export { className as class };

  const { className: ignore, ...rest } = $$restProps;

  export let size: "default" | "sm" = "default";
  export let theme: "primary" | "success" | "danger" | "default" = "default";
  export let disabled: boolean = false;
  export let running: boolean;
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
