<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    labelText: string;
    children: Snippet;
  };
  let { labelText, children }: Props = $props();
</script>

<div>
  <label class="flex flex-col gap-0.5">
    <span class="text-sm">{labelText}</span>
    {@render children()}
  </label>
</div>
