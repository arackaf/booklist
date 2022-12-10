<script lang="ts">
  import type { Subject } from "$data/types";
  import Stack from "$lib/components/layout/Stack.svelte";
  import FlowItems from "../../layout/FlowItems.svelte";
  import { toHash } from "$lib/state/helpers";

  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import LabelDisplay from "../LabelDisplay.svelte";

  export let currentlySelected: any[];
  export let onRemove: ((s: Subject) => void) | null = null;

  export let subjects: Subject[];
  export let vertical: boolean = false;
  export let style: string = "";
  export let href: ((s: Subject) => string | null) | null = null;

  $: Component = vertical ? Stack : FlowItems;

  $: subjectHash = toHash(subjects);
</script>

<svelte:component this={Component} tightest={true} {style}>
  {#each currentlySelected.filter(_id => subjectHash[_id]).map(_id => subjectHash[_id]) as s}
    {#if onRemove}
      <RemovableLabelDisplay item={s} doRemove={() => onRemove?.(s)} />
    {:else}
      <LabelDisplay item={s} href={href != null ? href(s) : null} />
    {/if}
  {/each}
</svelte:component>
