<script lang="ts">
  import { filterTags, tagsState } from "app/state/tagsState";
  import GenericLabelSelect from "../GenericLabelSelect.svelte";

  export let onSelect;
  export let placeholder = "Tags";
  export let currentlySelected = [];

  $: ({ tags } = $tagsState);
  let search = "";

  const doSelect = item => {
    onSelect(item);
    search = "";
  };

  $: itemHash = currentlySelected.reduce((hash, _idOrObj) => ((hash[_idOrObj] = true), hash), {});
  $: eligible = filterTags(
    tags.filter(s => !itemHash[s._id]),
    search
  );
</script>

<GenericLabelSelect {placeholder} bind:search inputProps={{ tabIndex: -1 }} options={eligible} onItemSelected={doSelect} />
