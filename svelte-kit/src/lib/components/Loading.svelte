<svelte:options runes={true} />

<script lang="ts">
  import { LoaderCircleIcon } from "lucide-svelte";
  import { fade } from "svelte/transition";
</script>

<div class="fixed top-1/3 left-1/2 z-99999 -translate-x-1/2 -translate-y-1/2" in:fade={{ delay: 50, duration: 200 }}>
  <LoaderCircleIcon class="animate-spin text-primary/30" size={92} />
</div>
