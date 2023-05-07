<script lang="ts">
  export let primary = true;
</script>

<button class:bg-primary-5={primary} class:text-primary-10={primary} class="m-0 rounded py-1.5 px-3 text-base focus:drop-shadow-lg">
  <slot />
</button>
