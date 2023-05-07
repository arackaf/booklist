<script lang="ts">
  export let disabled: boolean;

  export let foo = "";
</script>

<button class="m-0 rounded {foo}" {disabled}>
  <slot />
</button>
