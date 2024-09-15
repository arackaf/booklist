<script lang="ts">
  import type { HierarchicalLabel } from "./types";
  import LabelDisplay from "./LabelDisplay.svelte";

  let { item }: { item: HierarchicalLabel } = $props();

  let effectiveChildLevel = $derived(item.childLevel - (item.prepend || []).length || 0);
</script>

<span style="display: flex; margin-left: {effectiveChildLevel * 15}px">
  <LabelDisplay {item} disabled={item.disabled} />
</span>
