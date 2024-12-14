<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="text-sm/4 text-neutral-500">
  {@render children()}
</div>
