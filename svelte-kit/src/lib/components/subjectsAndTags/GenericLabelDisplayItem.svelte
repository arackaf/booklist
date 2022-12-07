<script lang="ts">
  import type { HierarchicalLabel } from "./types";
  import LabelDisplay from "./LabelDisplay.svelte";

  export let item: HierarchicalLabel;
  let effectiveChildLevel = item.childLevel - (item.prepend || []).length || 0;
</script>

<span style="display: flex; margin-left: {effectiveChildLevel * 15}px">
  <LabelDisplay extraStyles="cursor: pointer" {item} disabled={item.disabled} />
</span>
