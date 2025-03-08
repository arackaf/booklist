<script lang="ts">
  import { untrack } from "svelte";

  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  import type { Color, Subject } from "$data/types";

  import { cn } from "$lib/utils";
  import Input from "$lib/components/ui/input/input.svelte";
  import InputLabel from "$lib/components/ui/label/label.svelte";

  import ColorsPalette from "$lib/components/ColorsPalette.svelte";
  import CustomColorPicker from "$lib/components/CustomColorPicker.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import { computeParentId, getChildSubjectsSorted, getEligibleParents, getSubjectsHash } from "$lib/state/subjectsState";
  import SelectAvailableSubjects from "./SelectAvailableSubjects.svelte";

  import LabelDisplay from "../LabelDisplay.svelte";

  type Props = {
    subject: Subject;
    allSubjects: Subject[];
    colors: Color[];
    onCancelEdit: () => void;
    deleteShowing?: boolean;
    onComplete?: () => void;
  };
  const textColors = ["#ffffff", "#000000"];

  let { subject, allSubjects, colors, onCancelEdit, deleteShowing = $bindable(), onComplete = () => {} }: Props = $props();

  let missingName = $state(false);
  let inputEl = $state<HTMLInputElement>(null as any);

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
      <div class="flex flex-col gap-1.5">
        <InputLabel for="subject-name">Name</InputLabel>

        <div class="flex flex-col gap-0.5">
          <Input
            id="subject-name"
            class={cn("focus:border-border", {
              "border-red-600": missingName,
              "focus-visible:ring-red-600": missingName
            })}
            bind:ref={inputEl}
            bind:value={editingSubject.name}
            name="name"
            placeholder="Subject name"
          />
          <div>
            <LabelDisplay item={{ ...editingSubject, name: editingSubject.name || "<subject preview>" }} />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <InputLabel>Parent</InputLabel>

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
          <Button type="submit" size="sm" disabled={saving}>Save</Button>
          <Button size="sm" variant="outline" type="button" disabled={saving} onclick={onCancelEdit}>Cancel</Button>
          {#if editingSubject.id}
            <Button size="sm" variant="destructive" class="ml-auto gap-1" type="button" disabled={saving} onclick={() => (deleteShowing = true)}>
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
      <div class="flex flex-col gap-2">
        <div class="font-bold text-xl leading-none">Delete {editingSubject.name}?</div>
        {#if childSubjects?.length}
          <div class="text-base">Child subjects will also be deleted!</div>
        {/if}
      </div>

      <div class="flex flex-row gap-3">
        <Button type="submit" size="sm" variant="destructive" disabled={deleting}>Delete it!</Button>
        <Button size="sm" variant="outline" type="button" disabled={deleting} onclick={() => (deleteShowing = false)}>Cancel</Button>
      </div>
    </div>
  </form>
{/if}
