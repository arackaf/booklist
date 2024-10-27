<script lang="ts">
  import type { Tag } from "$data/types";
  import { toHash } from "$lib/state/helpers";

  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import LabelDisplay from "../LabelDisplay.svelte";

  export let currentlySelected: number[];
  export let onRemove: ((tag: Tag) => void) | null = null;

  export let tags: Tag[];
  export let vertical: boolean = false;
  export let href: ((s: Tag) => string | null) | null = null;

  $: tagHash = toHash(tags);

  $: selectedLabels = currentlySelected
    .filter(id => tagHash[id])
    .map(id => tagHash[id])
    .sort((a, b) => a.name.localeCompare(b.name));
</script>

<div class="flex gap-1" class:flex-col={vertical} class:items-start={vertical} class:flex-wrap={!vertical}>
  {#each selectedLabels as t}
    {#if onRemove}
      <RemovableLabelDisplay item={t} doRemove={() => onRemove?.(t)} />
    {:else}
      <LabelDisplay class="flex" item={t} href={href != null ? href(t) : null} />
    {/if}
  {/each}
</div>
