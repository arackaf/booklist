<script lang="ts">
  import { stackedSubjects, filterSubjects, subjectsState } from "app/state/subjectsState";
  import GenericLabelSelect from "../GenericLabelSelect.svelte";

  export let onSelect;
  export let placeholder = "Subjects";
  export let currentlySelected = [];

  $: ({ subjectsUnwound } = $stackedSubjects);
  $: ({ subjectHash } = $subjectsState);

  let search = "";

  const doSelect = item => {
    onSelect(item);
    search = "";
  };

  $: itemHash = currentlySelected.reduce((hash, _idOrObj) => ((hash[_idOrObj] = true), hash), {});

  $: eligible = filterSubjects(subjectsUnwound, search, subjectHash, itemHash);
</script>

<GenericLabelSelect {placeholder} bind:search inputProps={{ tabIndex: -1 }} options={eligible} onItemSelected={doSelect} />