<script lang="ts">
  import AutoSuggest from "svelte-helpers/AutoSuggest";
  import GenericLabelDisplayItem from "./GenericLabelDisplayItem.svelte";

  export let options;
  export let placeholder = "";
  export let inputProps = {};
  export let search = "";
  export let onItemSelected;

  let inputStyles = "width: 100px; border-top-width: 0; border-right-width: 0; border-left-width: 0; border-radius: 0;";
</script>

<div>
  <AutoSuggest {options} {inputProps} {placeholder} {onItemSelected} {inputStyles} filterField="name" bind:currentSearch={search}>
    <span slot="result" let:option>
      <GenericLabelDisplayItem item={option} />
    </span>
  </AutoSuggest>
</div>
