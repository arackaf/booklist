<script lang="ts">
  import LabelDisplay from "./LabelDisplay.svelte";

  export let item;
  let effectiveChildLevel = item.childLevel - (item.prepend || []).length || 0;
</script>

<span style="margin-left: {effectiveChildLevel * 15}px">
  {#each item.prepend || [] as s}
    <!-- <LabelDisplay style={{ marginRight: "5px", cursor: "pointer" }} item={s} disabled={true} /> -->
    <!-- <i className="fal fa-level-up" style={{ transform: `rotate(90deg) translateX(2px)`, margin: `0 7px 0 3px` }}></i> -->
  {/each}
  <LabelDisplay extraStyles="cursor: pointer" {item} />
</span>
