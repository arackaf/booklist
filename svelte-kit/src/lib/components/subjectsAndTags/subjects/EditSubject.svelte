<script lang="ts">
  import { onMount } from "svelte";
  import cn from "classnames";

  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  import type { Color, Subject } from "$data/types";

  import ColorsPalette from "$lib/components/ui/ColorsPalette.svelte";
  import CustomColorPicker from "$lib/components/ui/CustomColorPicker.svelte";
  import Button from "$lib/components/buttons/Button.svelte";

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
    inputEl.focus();
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
        <div class="form-group">
          <label for="subject-name">Name</label>
          <input
            id="subject-name"
            bind:this={inputEl}
            bind:value={editingSubject.name}
            name="name"
            placeholder="Subject name"
            class={cn("form-control", { error: missingName })}
          />
          {#if missingName}
            <span style="margin-top: 5px; display: inline-block;" class="label label-danger"> Subjects need names! </span>
            <br />
          {/if}
          <div
            class="label label-default"
            style="background-color: {editingSubject.backgroundColor}; color: {editingSubject.textColor}; max-width: 100%; overflow: hidden; align-self: flex-start;"
          >
            {editingSubject.name.trim() || "<label preview>"}
          </div>
        </div>
      </div>
      <div>
        <div class="form-group">
          <label for="subject-parent">Parent</label>
          <select id="subject-parent" bind:value={editingSubject.parentId} name="parentId" class="form-control">
            <option value={0}>No Parent</option>
            {#each eligibleParents as s}
              <option value={s.id}>{s.name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div>
        <div class="form-group">
          <span>Label Color</span>
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
        <div class="form-group">
          <span>Text Color</span>
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
          <Button disabled={saving} preset="primary-xs">Save</Button>
          <Button type="button" disabled={saving} preset="default-xs" onClick={onCancelEdit}>Cancel</Button>
          {#if editingSubject.id}
            <Button class="ml-auto" type="button" disabled={saving} preset="danger-xs" onClick={() => (deleteShowing = true)}>
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
        <Button disabled={deleting} preset="danger-xs">
          {#if deleting}
            <span>Deleting <i class="far fa-spinner fa-spin" /> </span>
          {:else}
            <span>Delete it!</span>
          {/if}
        </Button>
        <Button disabled={deleting} onClick={() => (deleteShowing = false)} class="btn btn-xs">Cancel</Button>
      </div>
    </div>
  </form>
{/if}
