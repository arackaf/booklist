<script lang="ts">
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

  import LabelDisplay from "../LabelDisplay.svelte";
  import { untrack } from "svelte";

  type Props = {
    subject: Subject;
    allSubjects: Subject[];
    colors: Color[];
    onCancelEdit: () => void;
    deleteShowing?: boolean;
    onComplete?: () => void;
    inputEl?: HTMLInputElement | undefined;
  };
  const textColors = ["#ffffff", "#000000"];

  let { subject, allSubjects, colors, onCancelEdit, deleteShowing = $bindable(), onComplete = () => {}, inputEl }: Props = $props();

  let missingName = $state(false);
  let originalName = $state("");
  let originalParentId = $state(0);

  let editingSubject = $state({ ...subject, parentId: computeParentId(subject.path) });

  $effect(() => {
    let currentSubject = subject;
    untrack(() => {
      editingSubjectChanged(currentSubject);
    });
  });

  let subjectHash = $derived(getSubjectsHash(allSubjects));
  let childSubjects = $derived(getChildSubjectsSorted(subject.id, subjectHash));

  let eligibleParents = $derived([{ id: -1, name: "None", path: null } as Subject, ...(getEligibleParents(subjectHash, editingSubject.id) || [])]);
  let selectedParent = $derived(editingSubject.parentId ? allSubjects.find(p => p.id == editingSubject.parentId) : null);

  $effect(() => {
    if (editingSubject.name) {
      missingName = false;
    }
  });

  function editingSubjectChanged(subject: any) {
    editingSubject = { ...subject, parentId: computeParentId(subject.path) };
    missingName = false;
    deleteShowing = false;
    originalName = subject.name;
    originalParentId = editingSubject.parentId;
  }

  let saving = $state(false);
  function runSave({ formData: data, cancel }: any) {
    const name = data.get("name");
    if (!name) {
      missingName = true;
      cancel();
      return;
    }

    saving = true;

    return async () => {
      window.dispatchEvent(new CustomEvent("reload-user-summary"));
      invalidateAll().then(() => {
        saving = false;
        onComplete();
      });
    };
  }

  let deleting = $state(false);
  function runDelete() {
    deleting = true;

    return async () => {
      window.dispatchEvent(new CustomEvent("reload-user-summary"));
      invalidateAll().then(() => {
        deleting = false;
        onComplete();
      });
    };
  }
</script>

{#if !editingSubject}
  <div></div>
{:else if !deleteShowing}
  <form method="POST" action="/subjects?/saveSubject" use:enhance={runSave}>
    <input type="hidden" name="id" value={editingSubject.id} />
    <input type="hidden" name="path" value={editingSubject.path} />
    <input type="hidden" name="originalParentId" value={originalParentId} />
    <input type="hidden" name="parentId" value={editingSubject.parentId || ""} />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm" for="subject-name">Name</label>

        <Input
          id="subject-name"
          class="h-9"
          error={missingName}
          bind:inputEl
          bind:value={editingSubject.name}
          name="name"
          placeholder="Subject name"
        />

        <div class="flex flex-col gap-1">
          {#if missingName}
            <Label theme="error" class="self-start">Subjects need names!</Label>
          {/if}
          <Label colors={editingSubject} style="max-width: 100%; overflow: hidden; align-self: flex-start;">
            {editingSubject.name.trim() || "<label preview>"}
          </Label>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-sm -mb-0.5 md:mb-0">Parent</span>

        <div>
          <SelectAvailableSubjects
            placeholder={selectedParent?.name}
            noHiddenFields={true}
            subjects={eligibleParents}
            currentlySelected={[editingSubject.parentId]}
            onSelect={subject => {
              editingSubject = { ...editingSubject, parentId: !subject || subject.id <= 0 ? 0 : subject.id };
            }}
            triggerClasses="w-full"
          >
            {#snippet renderPlaceholder()}
              <span>
                {#if selectedParent}
                  <LabelDisplay item={selectedParent} />
                {:else}
                  <span>Select</span>
                {/if}
              </span>
            {/snippet}
          </SelectAvailableSubjects>
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
          <Button size="sm" type="button" disabled={saving} onclick={onCancelEdit}>Cancel</Button>
          {#if editingSubject.id}
            <Button size="sm" theme="danger" class="ml-auto gap-1" type="button" disabled={saving} onclick={() => (deleteShowing = true)}>
              <span>
                Delete {originalName}
              </span>
              <i class="fal fa-fw fa-trash-alt"></i>
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
        <Button size="sm" type="button" disabled={deleting} onclick={() => (deleteShowing = false)}>Cancel</Button>
      </div>
    </div>
  </form>
{/if}
