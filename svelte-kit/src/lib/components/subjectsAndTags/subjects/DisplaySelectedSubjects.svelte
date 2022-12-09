<script lang="ts">
  import type { Subject } from "$data/types";

  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import LabelDisplay from "../LabelDisplay.svelte";
  import FlowItems from "../../layout/FlowItems.svelte";
  import { toHash } from "$lib/state/helpers";

  export let currentlySelected: any[];
  export let onRemove: ((s: Subject) => void) | null = null;

  export let subjects: Subject[];

  $: subjectHash = toHash(subjects);
</script>

<FlowItems tightest={true}>
  {#each currentlySelected.filter(_id => subjectHash[_id]).map(_id => subjectHash[_id]) as t}
    {#if onRemove}
      <RemovableLabelDisplay item={t} doRemove={() => onRemove?.(t)} />
    {:else}
      <LabelDisplay item={t} />
    {/if}
  {/each}
</FlowItems>
