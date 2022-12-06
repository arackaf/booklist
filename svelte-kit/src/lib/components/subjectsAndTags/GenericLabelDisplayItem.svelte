<script lang="ts">
  import LabelDisplay from "./LabelDisplay.svelte";

  export let item;
  let effectiveChildLevel = item.childLevel - (item.prepend || []).length || 0;
</script>

<span style="display: flex; margin-left: {effectiveChildLevel * 15}px">
  {#each item.prepend || [] as s}
    <LabelDisplay extraStyles="margin-right: 5px; cursor: pointer" item={s} disabled={true} />
    <i class="fal fa-level-up" style="transform: rotate(90deg) translateX(2px); margin: 0 7px 0 3px;" />
  {/each}
  <LabelDisplay extraStyles="cursor: pointer" {item} />
</span>
