<script lang="ts">
  import type { Snippet } from "svelte";
  import type { DisablableSubject, Subject } from "$data/types";
  import { filterSubjects, subjectState } from "$lib/state/subjectsState";

  import GenericLabelSelect from "../GenericLabelSelect.svelte";

  type Props = {
    onSelect: (item: DisablableSubject) => void;
    placeholder?: string;
    currentlySelected?: number[];
    subjects: Subject[];
    size?: "sm" | "default";
    triggerClasses?: string;
    noHiddenFields?: boolean;
    disabled?: boolean;
    renderPlaceholder?: Snippet;
  };

  let {
    onSelect,
    placeholder,
    currentlySelected = [],
    subjects,
    size = "default",
    triggerClasses = "",
    noHiddenFields = false,
    disabled,
    renderPlaceholder: placeholderSnippetPassed
  }: Props = $props();

  let search = $state("");

  const doSelect = (item: DisablableSubject) => {
    if (item.disabled) {
      return false;
    }
    onSelect(item);
    search = "";
  };

  type LookupHash = { [id: string]: true };

  const selectedHash = $derived(currentlySelected.reduce<LookupHash>((hash, _idOrObj) => ((hash[_idOrObj] = true), hash), {}));
  const subjectsPacket = $derived(subjectState(subjects));
  const eligible = $derived(filterSubjects(subjectsPacket.subjectsUnwound, search, subjectsPacket.subjectHash, selectedHash));
</script>

{#if !noHiddenFields}
  {#each currentlySelected as id}
    <input type="hidden" name="subjects" value={id} />
  {/each}
{/if}
<GenericLabelSelect {disabled} {placeholder} {size} bind:search options={() => eligible} onItemSelected={doSelect} {triggerClasses}>
  {#snippet renderPlaceholder()}
    {#if placeholderSnippetPassed}
      {@render placeholderSnippetPassed()}
    {:else}
      {placeholder ?? "Search"}
    {/if}
  {/snippet}
</GenericLabelSelect>
