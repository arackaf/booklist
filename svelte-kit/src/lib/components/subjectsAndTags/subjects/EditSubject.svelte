<script lang="ts">
  import { onMount } from "svelte";

  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  import type { Color, Subject } from "$data/types";

  import Alert from "$lib/components/Alert.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import ActionButton from "$lib/components/Button/ActionButton.svelte";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import Label from "$lib/components/form-elements/Label/Label.svelte";
  import ColorsPalette from "$lib/components/ColorsPalette.svelte";
  import CustomColorPicker from "$lib/components/CustomColorPicker.svelte";

  import { computeParentId, getChildSubjectsSorted, getEligibleParents, getSubjectsHash } from "$lib/state/subjectsState";
  import SelectAvailableSubjects from "./SelectAvailableSubjects.svelte";
  import DisplaySelectedSubjects from "./DisplaySelectedSubjects.svelte";

  import LabelDisplay from "../LabelDisplay.svelte";

  export let subject: Subject;
  export let allSubjects: Subject[];
  export let colors: Color[];

  export let onCancelEdit: () => void;
  export let deleteShowing = false;

  export let onComplete = () => {};

  const textColors = ["#ffffff", "#000000"];

  let missingName = false;
  export let inputEl: HTMLInputElement | undefined = undefined;

  let originalName = "";
  let originalParentId = 0;

  let editingSubject = { ...subject, parentId: computeParentId(subject.path) };

  $: editingSubjectChanged(subject);

  $: subjectHash = getSubjectsHash(allSubjects);
  $: childSubjects = getChildSubjectsSorted(subject.id, subjectHash);

  $: eligibleParents = [{ id: -1, name: "None", path: null } as Subject, ...(getEligibleParents(subjectHash, editingSubject.id) || [])];
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

  $: selectedParent = editingSubject.parentId ? allSubjects.find(p => p.id == editingSubject.parentId) : null;

  let saving = false;
  function runSave({ formData: data, cancel }: any) {
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
    <input type="hidden" name="parentId" value={editingSubject.parentId || ""} />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
      <div class="flex flex-col gap-0.5">
        <label class="text-sm" for="subject-name">Name</label>
        <div class="h-8">
          <Input id="subject-name" error={missingName} bind:inputEl bind:value={editingSubject.name} name="name" placeholder="Subject name" />
        </div>
        <div class="flex flex-col gap-1 mt-0.5">
          {#if missingName}
            <Label theme="error" class="self-start">Subjects need names!</Label>
          {/if}
          <Label colors={editingSubject} style="max-width: 100%; overflow: hidden; align-self: flex-start;">
            {editingSubject.name.trim() || "<label preview>"}
          </Label>
        </div>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-sm -mb-0.5 md:mb-0">Parent</span>

        <div class="h-8">
          <SelectAvailableSubjects
            placeholder={selectedParent?.name}
            noHiddenFields={true}
            subjects={eligibleParents}
            currentlySelected={[editingSubject.parentId]}
            onSelect={subject => {
              editingSubject = { ...editingSubject, parentId: !subject || subject.id <= 0 ? 0 : subject.id };
            }}
          >
            <span slot="placeholder">
              {#if selectedParent}
                <LabelDisplay item={selectedParent} />
              {:else}
                <span>Select</span>
              {/if}
            </span>
          </SelectAvailableSubjects>
        </div>
        <div class="mt-0.5">
          <DisplaySelectedSubjects
            onRemove={() => (editingSubject.parentId = 0)}
            subjects={eligibleParents}
            currentlySelected={[editingSubject.parentId]}
          />
        </div>
      </div>

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
            currentColor={editingSubject.textColor}
          />
          <input type="hidden" name="textColor" value={editingSubject.textColor} />
        </div>
      </div>
      <div class="md:col-span-2">
        <div class="flex flex-row gap-3">
          <Button size="sm" theme="primary" disabled={saving}>Save</Button>
          <Button size="sm" type="button" disabled={saving} on:click={onCancelEdit}>Cancel</Button>
          {#if editingSubject.id}
            <Button size="sm" theme="danger" class="ml-auto gap-1" type="button" disabled={saving} on:click={() => (deleteShowing = true)}>
              <span>
                Delete {originalName}
              </span>
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
      <Alert type="error" layout="slim">
        <div class="flex flex-row gap-2">
          <span>Delete {editingSubject.name}?</span>
          {#if childSubjects?.length}<strong>Child subjects will also be deleted!</strong>{/if}
        </div>
      </Alert>

      <div class="flex flex-row gap-3">
        <ActionButton size="sm" theme="danger" running={deleting}>Delete it!</ActionButton>
        <Button size="sm" type="button" disabled={deleting} on:click={() => (deleteShowing = false)}>Cancel</Button>
      </div>
    </div>
  </form>
{/if}
