<script lang="ts">
  import Button from "./Button.svelte";

  export let type: "primary" | "danger" | "default" = "default";
  export let disabled: boolean;
  export let running: boolean;
</script>

<Button on:click {type} disabled={disabled || running}>
  {#if !running}
    <slot />
  {:else}
    <slot name="running">
      <slot />
    </slot>
  {/if}
</Button>
