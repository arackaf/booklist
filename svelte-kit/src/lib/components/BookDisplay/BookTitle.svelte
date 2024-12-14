<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    truncate?: boolean;
    children: Snippet;
  };
  let { truncate = false, children }: Props = $props();
</script>

<div class="text-base/5" class:truncate>
  {@render children()}
</div>
