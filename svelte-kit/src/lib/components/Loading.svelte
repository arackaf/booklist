<svelte:options runes={true} />

<script lang="ts">
  import { fade } from "svelte/transition";
</script>

<div class="fixed top-1/3 left-1/2 z-[99999] -translate-x-1/2 -translate-y-1/2" in:fade={{ delay: 50, duration: 200 }}>
  <i class="far fa-5x fa-spin fa-spinner text-primary-3 opacity-50"></i>
</div>
