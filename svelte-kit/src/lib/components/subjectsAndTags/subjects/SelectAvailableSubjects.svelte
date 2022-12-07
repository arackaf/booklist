<script lang="ts">
  import type { Subject } from "$data/types";
  import type { Label } from "../types";
  import { filterSubjects, subjectState } from "$lib/state/subjectsState";

  import GenericLabelSelect from "../GenericLabelSelect.svelte";

  export let onSelect: (item: Label) => void;
  export let placeholder = "Subjects";
  export let currentlySelected: string[] = [];

  export let subjects: Subject[];

  let search = "";

  const doSelect = (item: Label) => {
    onSelect(item);
    search = "";
  };

  type LookupHash = { [_id: string]: true };
  $: itemHash = currentlySelected.reduce<LookupHash>((hash, _idOrObj) => ((hash[_idOrObj] = true), hash), {});

  $: subjectsPacket = subjectState(subjects);

  $: eligible = filterSubjects(subjectsPacket.subjectsUnwound, search, subjectsPacket.subjectHash, itemHash);
</script>

<GenericLabelSelect {placeholder} noFiltering={true} bind:search options={eligible} onItemSelected={doSelect} />
