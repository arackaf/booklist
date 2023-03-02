<script lang="ts">
  import type { Tag } from "$data/types";
  import Stack from "$lib/components/layout/Stack.svelte";
  import FlowItems from "../../layout/FlowItems.svelte";
  import { toHash } from "$lib/state/helpers";

  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import LabelDisplay from "../LabelDisplay.svelte";

  export let currentlySelected: number[];
  export let onRemove: ((tag: Tag) => void) | null = null;

  export let tags: Tag[];
  export let vertical: boolean = false;
  export let style: string = "";
  export let href: ((s: Tag) => string | null) | null = null;

  $: Component = vertical ? Stack : FlowItems;

  $: tagHash = toHash(tags);
</script>

<svelte:component this={Component} tightest={true} {style}>
  {#each currentlySelected.filter(id => tagHash[id]).map(id => tagHash[id]) as t}
    {#if onRemove}
      <RemovableLabelDisplay item={t} doRemove={() => onRemove?.(t)} />
    {:else}
      <LabelDisplay item={t} href={href != null ? href(t) : null} />
    {/if}
  {/each}
</svelte:component>
