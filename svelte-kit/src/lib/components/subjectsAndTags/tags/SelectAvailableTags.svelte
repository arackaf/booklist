<script lang="ts">
  import type { Tag } from "$data/types";
  import { filterTags } from "$lib/state/tagsState";

  import GenericLabelSelect from "../GenericLabelSelect.svelte";

  type TagSelectedHash = { [id: string]: true };
  type Props = {
    tags: Tag[];
    onSelect: (tag: Tag) => void;
    placeholder?: string;
    currentlySelected: number[];
    popoverClass?: string;
  };

  let { tags, onSelect, placeholder = "Tags", currentlySelected = [], popoverClass = "" }: Props = $props();

  let search = $state("");

  const doSelect = (item: any) => {
    onSelect(item);
    search = "";
  };

  let itemHash = $derived(currentlySelected.reduce<TagSelectedHash>((hash, id) => ((hash[id] = true), hash), {}));

  let eligible = $derived(
    filterTags(
      tags.filter(s => !itemHash[s.id]),
      search
    )
  );
</script>

{#each currentlySelected as id}
  <input type="hidden" name="tags" value={id} />
{/each}
<GenericLabelSelect {placeholder} bind:search options={() => eligible} onItemSelected={doSelect} {popoverClass} />
