<script lang="ts">
  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import { tagsState } from "app/state/tagsState";
  import FlowItems from "../../layout/FlowItems.svelte";

  export let onRemove;
  export let currentlySelected;

  $: ({ tagHash } = $tagsState);
</script>

<FlowItems tightest={true}>
  {#each currentlySelected.filter(_id => tagHash[_id]).map(_id => tagHash[_id]) as t}
    <RemovableLabelDisplay item={t} doRemove={() => onRemove(t)} />
  {/each}
</FlowItems>
