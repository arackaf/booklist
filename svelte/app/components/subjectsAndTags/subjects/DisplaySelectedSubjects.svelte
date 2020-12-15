<script lang="ts">
  import RemovableLabelDisplay from "../RemovableLabelDisplay.svelte";
  import { subjectsState } from "app/state/subjectsState";
  import FlowItems from "../../layout/FlowItems.svelte";

  export let currentlySelected: any[];
  export let onRemove: any;

  $: ({ subjectHash } = $subjectsState);
</script>

<FlowItems tightest={true}>
  {#each currentlySelected.filter(_id => subjectHash[_id]).map(_id => subjectHash[_id]) as t}
    <RemovableLabelDisplay item={t} doRemove={() => onRemove(t)} />
  {/each}
</FlowItems>
