<script lang="ts">
  import type { Subject } from "$data/types";
  import { toHash } from "$lib/state/helpers";

  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import LabelDisplay from "../LabelDisplay.svelte";

  export let currentlySelected: any[];
  export let onRemove: ((s: Subject) => void) | null = null;

  export let subjects: Subject[];
  export let vertical: boolean = false;
  export let href: ((s: Subject) => string | null) | null = null;

  $: subjectHash = toHash(subjects);

  $: selectedLabels = currentlySelected.filter(id => subjectHash[id]).map(id => subjectHash[id]);
</script>

<div class="flex gap-1" class:flex-col={vertical} class:items-start={vertical} class:flex-wrap={!vertical}>
  {#each selectedLabels as s (s.id)}
    {#if onRemove}
      <RemovableLabelDisplay item={s} doRemove={() => onRemove?.(s)} />
    {:else}
      <LabelDisplay class="flex" item={s} href={href != null ? href(s) : null} />
    {/if}
  {/each}
</div>
