<script lang="ts">
  import { onMount } from "svelte";
  import cn from "classnames";

  import type { Color, Subject } from "$data/types";

  import Stack from "$lib/components/layout/Stack.svelte";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import ColorsPalette from "$lib/components/ui/ColorsPalette.svelte";
  import CustomColorPicker from "$lib/components/ui/CustomColorPicker.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import { computeParentId, getChildSubjectsSorted, getEligibleParents, getSubjectsHash } from "$lib/state/subjectsState";
  import { enhance } from "$app/forms";

  export let subject: any;
  export let allSubjects: Subject[];
  export let colors: Color[];

  export let onCancelEdit: any;
  export let deleteShowing = false;

  const deleteIt = () => {};

  const textColors = ["#ffffff", "#000000"];

  let missingName = false;
  let inputEl: any;

  let originalName = "";

  onMount(() => {
    inputEl?.focus({ preventScroll: true });

    return () => {
      deleteShowing = false;
    };
  });

  let editingSubject = { ...subject, parentId: computeParentId(subject.path) };

  $: editingSubjectChanged(subject);

  $: subjectHash = getSubjectsHash(allSubjects);
  $: childSubjects = getChildSubjectsSorted(subject._id, subjectHash);

  //let colorsState = writable({ colors: [] });
  //$: ({ colors } = $colorsState);
  $: eligibleParents = getEligibleParents(subjectHash, editingSubject._id) || [];
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
  }

  const runSave = () => {
    // if (!editingSubject.name.trim()) {
    // 	return (missingName = true);
    // }
    // let { _id, name, parentId, backgroundColor, textColor } = editingSubject;
    // let request = { _id, name, parentId, backgroundColor, textColor };
    //Promise.resolve(updateState.runMutation(request)).then(onCancelEdit);
  };

  let updateState = {} as any;
  let deleteState = {} as any;
</script>

{#if !editingSubject}
  <div />
{:else}
  <FlexRow>
    {#if !deleteShowing}
      <FlexRow>
        <div class="col-xs-12 col-lg-6">
          <div class="form-group">
            <label>Name</label>
            <input bind:this={inputEl} bind:value={editingSubject.name} class={cn("form-control", { error: missingName })} />
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
        <div class="col-xs-12 col-lg-6">
          <div class="form-group">
            <label>Parent</label>
            <select bind:value={editingSubject.parentId} class="form-control">
              <option value="">No Parent</option>
              {#each eligibleParents as s}
                <option value={s._id}>{s.name}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="form-group">
            <label>Label Color</label>
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
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="form-group">
            <label>Text Color</label>
            <ColorsPalette currentColor={editingSubject.textColor} colors={textColors} onColorChosen={color => (editingSubject.textColor = color)} />
            <CustomColorPicker
              labelStyle="margin-left: 3px"
              onColorChosen={color => (editingSubject.textColor = color)}
              currentColor={editingSubject.backgroundColor}
            />
          </div>
        </div>
        <div class="col-xs-12">
          <FlowItems pushLast={true}>
            <form method="POST" action="/subjects?/saveSubject" use:enhance>
              <input type="hidden" name="a" value="b" />
              <Button disabled={updateState.running} preset="primary-xs">
                Save
                <i class={`far fa-fw ${updateState.running ? "fa-spinner fa-spin" : "fa-save"}`} />
              </Button>
            </form>
            <Button disabled={updateState.running} preset="default-xs" onClick={onCancelEdit}>Cancel</Button>
            {#if editingSubject._id}
              <Button disabled={updateState.running} preset="danger-xs" onClick={() => (deleteShowing = true)}>
                Delete
                {originalName}
                <i class="far fa-fw fa-trash" />
              </Button>
            {/if}
          </FlowItems>
        </div>
      </FlexRow>
    {:else}
      <div class="col-xs-12">
        <Stack>
          <div class="alert alert-danger alert-slim" style="align-self: flex-start">
            <FlowItems tighter={true}>
              <span>Delete {editingSubject.name}?</span>
              {#if childSubjects?.length}<strong>Child subjects will also be deleted!</strong>{/if}
            </FlowItems>
          </div>
          <FlowItems>
            <Button disabled={deleteState.running} onClick={deleteIt} preset="danger-xs">
              {#if deleteState.running}
                <span>Deleting <i class="far fa-spinner fa-spin" /> </span>
              {:else}
                Delete it!
              {/if}
            </Button>
            <Button disabled={deleteState.running} onClick={() => (deleteShowing = false)} class="btn btn-xs">Cancel</Button>
          </FlowItems>
        </Stack>
      </div>
    {/if}
  </FlexRow>
{/if}
