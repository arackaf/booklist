<script lang="ts">
  import type { Tag } from "$data/types";
  import { filterTags } from "$lib/state/tagsState";

  import GenericLabelSelect from "../GenericLabelSelect.svelte";

  export let tags: Tag[];
  export let onSelect: (tag: Tag) => void;
  export let placeholder = "Tags";
  export let currentlySelected: string[] = [];

  let search = "";

  const doSelect = (item: any) => {
    onSelect(item);
    search = "";
  };

  type TagSelectedHash = { [_id: string]: true };

  $: itemHash = currentlySelected.reduce<TagSelectedHash>((hash, _id) => ((hash[_id] = true), hash), {});

  $: eligible = filterTags(
    tags.filter(s => !itemHash[s._id]),
    search
  );
</script>

{#each currentlySelected as _id}
  <input type="hidden" name="tags" value={_id} />
{/each}
<GenericLabelSelect {placeholder} bind:search options={() => eligible} onItemSelected={doSelect} />
