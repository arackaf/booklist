<script lang="ts">
  import type { Subject } from "$data/types";
  import { filterSubjects, subjectState } from "$lib/state/subjectsState";

  //import { stackedSubjects, filterSubjects, subjectsState } from "app/state/subjectsState";
  import GenericLabelSelect from "../GenericLabelSelect.svelte";
  import type { Label } from "../types";

  export let onSelect: (item: Label) => void;
  export let placeholder = "Subjects";
  export let currentlySelected: string[] = [];

  export let subjects: Subject[];

  console.log(subjects);

  //$: ({ subjectsUnwound } = $stackedSubjects);
  //$: ({ subjectHash } = $subjectsState);

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

<GenericLabelSelect {placeholder} bind:search options={eligible} onItemSelected={doSelect} />
