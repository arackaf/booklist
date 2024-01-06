<script lang="ts">
  import AutoSuggest from "svelte-helpers/AutoSuggest.svelte";
  import GenericLabelDisplayItem from "./GenericLabelDisplayItem.svelte";

  export let options: any;
  export let placeholder = "";
  export let inputProps = { class: "md:text-sm text-base" };
  export let search = "";
  export let onItemSelected: (option: any, inputEl: HTMLInputElement) => void;
  export let noFiltering = false;

  let inputPropsToUse: any;

  $: {
    inputPropsToUse = inputProps;
    if (!inputPropsToUse.class) {
      inputPropsToUse.class = "md:text-sm text-base";
    }
  }

  let inputStyles = "width: 100px; border-top-width: 0; border-right-width: 0; border-left-width: 0; border-radius: 0;";
</script>

<div class="generic-label-select">
  <AutoSuggest
    keyField="id"
    {options}
    inputProps={inputPropsToUse}
    {placeholder}
    {onItemSelected}
    {inputStyles}
    {noFiltering}
    filterField="name"
    bind:currentSearch={search}
  >
    <span slot="result" let:option>
      <GenericLabelDisplayItem item={option} />
    </span>
  </AutoSuggest>
</div>
