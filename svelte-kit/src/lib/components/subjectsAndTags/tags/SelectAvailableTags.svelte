<script lang="ts">
  import type { Tag } from "$data/types";

  //import { filterTags, tagsState } from "app/state/tagsState";
  import GenericLabelSelect from "../GenericLabelSelect.svelte";

  export let allTags: Tag[];
  export let onSelect: (tag: Tag) => void;
  export let placeholder = "Tags";
  export let currentlySelected: string[] = [];

  //$: ({ tags } = $tagsState);
  let search = "";

  const doSelect = (item: any) => {
    onSelect(item);
    search = "";
  };

  type TagSelectedHash = { [_id: string]: true };

  $: itemHash = currentlySelected.reduce<TagSelectedHash>((hash, _id) => ((hash[_id] = true), hash), {});
  const eligible: Tag[] = allTags;
  // $: eligible = filterTags(
  //   tags.filter(s => !itemHash[s._id]),
  //   search
  // );
</script>

<GenericLabelSelect {placeholder} bind:search options={eligible} onItemSelected={doSelect} />
