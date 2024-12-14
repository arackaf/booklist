<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = { children: Snippet };

  let { children }: Props = $props();
</script>

<div class="flex border-b border-primary-9">
  {@render children()}
</div>
