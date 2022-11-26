<script lang="ts">
  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import LabelDisplay from "../LabelDisplay.svelte";
  import { tagsState } from "app/state/tagsState";
  import FlowItems from "../../layout/FlowItems.svelte";

  export let onRemove = null;
  export let currentlySelected;

  $: ({ tagHash } = $tagsState);
</script>

<FlowItems tightest={true}>
  {#each currentlySelected.filter(_id => tagHash[_id]).map(_id => tagHash[_id]) as t}
    {#if onRemove}
      <RemovableLabelDisplay item={t} doRemove={() => onRemove(t)} />
    {:else}
      <LabelDisplay item={t} />
    {/if}
  {/each}
</FlowItems>
