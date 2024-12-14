<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<div class="sticky-content mb-1 z-[3] pb-1 bg-[var(--content-background)]">
  <nav class="flex border-b border-b-[var(--primary-9)] mt-[calc(-1*var(--main-spacing-top))]">
    {@render children()}
  </nav>
</div>
