<script lang="ts">
  import Button from "./Button.svelte";

  export let type: "primary" | "danger" | "default" = "default";
  export let disabled: boolean;
</script>

<Button {type} {disabled} icon={true}>
  <slot />
</Button>
