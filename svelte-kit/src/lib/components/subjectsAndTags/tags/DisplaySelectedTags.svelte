<script lang="ts">
  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import LabelDisplay from "../LabelDisplay.svelte";

  import FlowItems from "../../layout/FlowItems.svelte";
  import type { Tag } from "$data/types";
  import { toHash } from "$lib/state/tagsState";

  export let tags: Tag[];
  export let onRemove: ((tag: Tag) => void) | null = null;
  export let currentlySelected: string[];

  $: tagHash = toHash(tags);
</script>

<FlowItems tightest={true}>
  {#each currentlySelected.filter(_id => tagHash[_id]).map(_id => tagHash[_id]) as t}
    <input type="hidden" name="tags" value={t._id} />
    {#if onRemove}
      <RemovableLabelDisplay item={t} doRemove={() => onRemove?.(t)} />
    {:else}
      <LabelDisplay item={t} />
    {/if}
  {/each}
</FlowItems>
