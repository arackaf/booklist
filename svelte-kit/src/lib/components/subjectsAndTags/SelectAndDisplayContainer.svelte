<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    class?: string;
    select: Snippet;
    display: Snippet;
  };
  let { class: className, select, display }: Props = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-2 {className}">
  <div>
    {@render select()}
  </div>
  <div class="flex items-center">
    {@render display()}
  </div>
</div>
