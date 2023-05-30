<script lang="ts">
  import { onMount } from "svelte";
  import cn from "classnames";

  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  import type { Color, Subject } from "$data/types";

  import Button from "$lib/components/ui/Button/Button.svelte";
  import ActionButton from "$lib/components/ui/Button/ActionButton.svelte";
  import Input from "$lib/components/ui/Input/Input.svelte";
  import InputGroup from "$lib/components/ui/Input/InputGroup.svelte";
  import Select from "$lib/components/ui/Select/Select.svelte";
  import SelectGroup from "$lib/components/ui/Select/SelectGroup.svelte";
  import ColorsPalette from "$lib/components/ui/ColorsPalette.svelte";
  import CustomColorPicker from "$lib/components/ui/CustomColorPicker.svelte";

  import { computeParentId, getChildSubjectsSorted, getEligibleParents, getSubjectsHash } from "$lib/state/subjectsState";

  export let subject: Subject;
  export let allSubjects: Subject[];
  export let colors: Color[];

  export let onCancelEdit: () => void;
  export let deleteShowing = false;

  export let onComplete = () => {};

  const textColors = ["#ffffff", "#000000"];

  let missingName = false;
  let inputEl: HTMLInputElement;

  let originalName = "";
  let originalParentId = 0;

  onMount(() => {
    inputEl?.focus({ preventScroll: true });

    return () => {
      deleteShowing = false;
    };
  });

  let editingSubject = { ...subject, parentId: computeParentId(subject.path) };

  $: editingSubjectChanged(subject);

  $: subjectHash = getSubjectsHash(allSubjects);
  $: childSubjects = getChildSubjectsSorted(subject.id, subjectHash);

  $: eligibleParents = getEligibleParents(subjectHash, editingSubject.id) || [];
  $: {
    if (editingSubject.name) {
      missingName = false;
    }
  }

  function editingSubjectChanged(subject: any) {
    editingSubject = { ...subject, parentId: computeParentId(subject.path) };
    missingName = false;
    deleteShowing = false;
    originalName = subject.name;
    originalParentId = editingSubject.parentId;
  }

  export const reset = () => {
    inputEl?.focus();
    deleteShowing = false;
  };

  let saving = false;
  function runSave({ data, cancel }: any) {
    const name = data.get("name");
    if (!name) {
      missingName = true;
      cancel();
      return;
    }

    saving = true;

    return async () => {
      invalidateAll().then(() => {
        saving = false;
        onComplete();
      });
    };
  }

  let deleting = false;
  function runDelete() {
    deleting = true;

    return async () => {
      invalidateAll().then(() => {
        deleting = false;
        onComplete();
      });
    };
  }
</script>

{#if !editingSubject}
  <div />
{:else if !deleteShowing}
  <form method="POST" action="/subjects?/saveSubject" use:enhance={runSave}>
    <input type="hidden" name="id" value={editingSubject.id} />
    <input type="hidden" name="path" value={editingSubject.path} />
    <input type="hidden" name="originalParentId" value={originalParentId} />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
      <div>
        <InputGroup labelText="Name">
          <Input slot="input" error={missingName} bind:inputEl bind:value={editingSubject.name} name="name" placeholder="Subject name" />
        </InputGroup>
        {#if missingName}
          <div style="margin-top: 5px; display: inline-block;" class="label label-danger">Subjects need names!</div>
          <br />
        {/if}
        <div
          class="label label-default"
          style="background-color: {editingSubject.backgroundColor}; color: {editingSubject.textColor}; max-width: 100%; overflow: hidden; align-self: flex-start;"
        >
          {editingSubject.name.trim() || "<label preview>"}
        </div>
      </div>
      <SelectGroup labelText="Parent">
        <Select slot="select" bind:value={editingSubject.parentId} name="parentId">
          <option value={0}>No Parent</option>
          {#each eligibleParents as s}
            <option value={s.id}>{s.name}</option>
          {/each}
        </Select>
      </SelectGroup>

      <div>
        <div class="flex flex-col">
          <span class="text-sm">Label Color</span>
          <ColorsPalette
            currentColor={editingSubject.backgroundColor}
            colors={colors.map(c => c.backgroundColor)}
            onColorChosen={color => (editingSubject.backgroundColor = color)}
          />
          <CustomColorPicker
            labelStyle="margin-left: 3px"
            onColorChosen={color => (editingSubject.backgroundColor = color)}
            currentColor={editingSubject.backgroundColor}
          />
          <input type="hidden" name="backgroundColor" value={editingSubject.backgroundColor} />
        </div>
      </div>
      <div>
        <div class="flex flex-col">
          <span class="text-sm">Text Color</span>
          <ColorsPalette currentColor={editingSubject.textColor} colors={textColors} onColorChosen={color => (editingSubject.textColor = color)} />
          <CustomColorPicker
            labelStyle="margin-left: 3px"
            onColorChosen={color => (editingSubject.textColor = color)}
            currentColor={editingSubject.backgroundColor}
          />
          <input type="hidden" name="textColor" value={editingSubject.textColor} />
        </div>
      </div>
      <div class="md:col-span-2">
        <div class="flex flex-row gap-3">
          <Button size="sm" theme="primary" disabled={saving}>Save</Button>
          <Button size="sm" type="button" disabled={saving} on:click={onCancelEdit}>Cancel</Button>
          {#if editingSubject.id}
            <Button size="sm" theme="danger" class="ml-auto" type="button" disabled={saving} on:click={() => (deleteShowing = true)}>
              Delete
              {originalName}
              <i class="fal fa-fw fa-trash-alt" />
            </Button>
          {/if}
        </div>
      </div>
    </div>
  </form>
{:else}
  <form method="POST" action="/subjects?/deleteSubject" use:enhance={runDelete}>
    <input type="hidden" name="id" value={editingSubject.id} />
    <div class="flex flex-col gap-3">
      <div class="alert alert-danger alert-slim">
        <div class="flex flex-row gap-2">
          <span>Delete {editingSubject.name}?</span>
          {#if childSubjects?.length}<strong>Child subjects will also be deleted!</strong>{/if}
        </div>
      </div>

      <div class="flex flex-row gap-3">
        <ActionButton size="sm" theme="danger" running={deleting}>Delete it!</ActionButton>
        <Button size="sm" type="button" disabled={deleting} on:click={() => (deleteShowing = false)} class="btn btn-xs">Cancel</Button>
      </div>
    </div>
  </form>
{/if}
