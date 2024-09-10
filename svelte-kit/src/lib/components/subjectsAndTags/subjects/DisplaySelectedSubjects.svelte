<script lang="ts">
  import type { Subject } from "$data/types";
  import { toHash } from "$lib/state/helpers";

  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import LabelDisplay from "../LabelDisplay.svelte";

  type Props = {
    currentlySelected: any[];
    onRemove?: ((s: Subject) => void) | null;
    subjects: Subject[];
    vertical?: boolean;
    href?: ((s: Subject) => string | null) | null;
    disabled?: boolean;
  };

  let { currentlySelected, onRemove = null, subjects, vertical = false, href = null, disabled = false }: Props = $props();

  let subjectHash = $derived(toHash(subjects));
  let selectedLabels = $derived(currentlySelected.filter(id => subjectHash[id]).map(id => subjectHash[id]));
</script>

<div class="flex gap-1" class:opacity-50={disabled} class:flex-col={vertical} class:items-start={vertical} class:flex-wrap={!vertical}>
  {#each selectedLabels as s (s.id)}
    {#if onRemove}
      <RemovableLabelDisplay {disabled} item={s} doRemove={() => onRemove?.(s)} />
    {:else}
      <LabelDisplay class="flex" item={s} href={href != null ? href(s) : null} />
    {/if}
  {/each}
</div>
