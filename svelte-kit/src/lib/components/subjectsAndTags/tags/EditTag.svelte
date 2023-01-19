<script lang="ts">
  import { onMount } from "svelte";
  import cn from "classnames";

  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  import type { Color, Tag } from "$data/types";

  import Stack from "$lib/components/layout/Stack.svelte";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import ColorsPalette from "$lib/components/ui/ColorsPalette.svelte";
  import CustomColorPicker from "$lib/components/ui/CustomColorPicker.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import Button from "$lib/components/buttons/Button.svelte";

  export let tag: Tag;
  export let allTags: Tag[];
  export let colors: Color[];

  export let onCancelEdit: () => void;
  export let deleteShowing = false;

  export let onComplete = () => {};

  const textColors = ["#ffffff", "#000000"];

  let missingName = false;
  let inputEl: HTMLInputElement;

  let originalName = "";

  onMount(() => {
    inputEl.focus({ preventScroll: true });

    return () => {
      deleteShowing = false;
    };
  });

  let editingTag = { ...tag };

  $: editingTagChanged(tag);

  $: {
    if (editingTag.name) {
      missingName = false;
    }
  }

  function editingTagChanged(tag: Tag) {
    editingTag = { ...tag };
    missingName = false;
    deleteShowing = false;
    originalName = tag.name;
  }

  export const reset = () => {
    inputEl.focus();
    deleteShowing = false;
  };

  let saving = false;
  function runSave({ data, action, cancel }: any) {
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

{#if !editingTag}
  <div />
{:else}
  <FlexRow>
    {#if !deleteShowing}
      <FlexRow>
        <div class="col-xs-12 col-lg-6">
          <div class="form-group">
            <label>Name</label>
            <input bind:this={inputEl} bind:value={editingTag.name} class={cn("form-control", { error: missingName })} />
            {#if missingName}<span style="margin-top: 5px; display: inline-block;" class="label label-danger"> Tags need names! </span> <br />{/if}
            <div
              class="label label-default"
              style="background-color: {editingTag.backgroundColor}; color: {editingTag.textColor}; max-width: 100%; overflow: hidden; align-self: flex-start;"
            >
              {editingTag.name.trim() || "<label preview>"}
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-lg-6" />
        <div class="col-xs-12 col-sm-6">
          <div class="form-group">
            <label>Label Color</label>
            <ColorsPalette currentColor={editingTag.backgroundColor} {colors} onColorChosen={color => (editingTag.backgroundColor = color)} />
            <CustomColorPicker
              labelStyle="margin-left: 3px"
              onColorChosen={color => (editingTag.backgroundColor = color)}
              currentColor={editingTag.backgroundColor}
            />
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="form-group">
            <label>Text Color</label>
            <ColorsPalette currentColor={editingTag.textColor} colors={textColors} onColorChosen={color => (editingTag.textColor = color)} />
            <CustomColorPicker
              labelStyle="margin-left: 3px"
              onColorChosen={color => (editingTag.textColor = color)}
              currentColor={editingTag.backgroundColor}
            />
          </div>
        </div>
        <div class="col-xs-12">
          <FlowItems pushLast={true}>
            <Button disabled={updateState.running} preset="primary-xs" onClick={runSave}>
              Save
              <i class={`far fa-fw ${updateState.running ? "fa-spinner fa-spin" : "fa-save"}`} />
            </Button>
            <Button disabled={updateState.running} preset="default-xs" onClick={onCancelEdit}>Cancel</Button>
            {#if editingTag._id}
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
            <FlowItems tighter={true}><span>Delete {originalName}?</span></FlowItems>
          </div>
          <FlowItems>
            <Button disabled={deleteState.running} onClick={deleteIt} preset="danger-xs">
              {#if deleteState.running}<span> Deleting <i class="far fa-spinner fa-spin" /> </span>{:else}"Delete it!"{/if}
            </Button>
            <Button disabled={deleteState.running} onClick={() => (deleteShowing = false)} class="btn btn-xs">Cancel</Button>
          </FlowItems>
        </Stack>
      </div>
    {/if}
  </FlexRow>
{/if}
