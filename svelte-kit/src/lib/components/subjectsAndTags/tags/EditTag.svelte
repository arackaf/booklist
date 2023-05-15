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

{#if !editingTag}
  <div />
{:else if !deleteShowing}
  <form method="POST" action="?/saveTag" use:enhance={runSave}>
    <input type="hidden" name="id" value={editingTag.id} />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
      <div class="md:col-span-2">
        <div class="form-group">
          <label for="tag-name">Name</label>
          <input
            id="tag-name"
            bind:this={inputEl}
            bind:value={editingTag.name}
            name="name"
            placeholder="Tag name"
            class={cn("form-control", { error: missingName })}
          />
          {#if missingName}
            <span style="margin-top: 5px; display: inline-block;" class="label label-danger">Tags need names!</span>
            <br />
          {/if}
          <div
            class="label label-default"
            style="background-color: {editingTag.backgroundColor}; color: {editingTag.textColor}; max-width: 100%; overflow: hidden; align-self: flex-start;"
          >
            {editingTag.name.trim() || "<label preview>"}
          </div>
        </div>
      </div>

      <div>
        <div class="form-group">
          <span>Label Color</span>
          <ColorsPalette
            currentColor={editingTag.backgroundColor}
            colors={colors.map(c => c.backgroundColor)}
            onColorChosen={color => (editingTag.backgroundColor = color)}
          />
          <CustomColorPicker
            labelStyle="margin-left: 3px"
            onColorChosen={color => (editingTag.backgroundColor = color)}
            currentColor={editingTag.backgroundColor}
          />
          <input type="hidden" name="backgroundColor" value={editingTag.backgroundColor} />
        </div>
      </div>
      <div>
        <div class="form-group">
          <span>Text Color</span>
          <ColorsPalette currentColor={editingTag.textColor} colors={textColors} onColorChosen={color => (editingTag.textColor = color)} />
          <CustomColorPicker
            labelStyle="margin-left: 3px"
            onColorChosen={color => (editingTag.textColor = color)}
            currentColor={editingTag.backgroundColor}
          />
          <input type="hidden" name="textColor" value={editingTag.textColor} />
        </div>
      </div>
      <div class="md:col-span-2">
        <FlowItems pushLast={true}>
          <Button disabled={saving} preset="primary-xs">Save</Button>
          <Button disabled={saving} preset="default-xs" onClick={onCancelEdit}>Cancel</Button>
          {#if editingTag.id}
            <Button disabled={saving} preset="danger-xs" onClick={() => (deleteShowing = true)}>
              Delete
              {originalName}
              <i class="fal fa-fw fa-trash-alt" />
            </Button>
          {/if}
        </FlowItems>
      </div>
    </div>
  </form>
{:else}
  <form method="POST" action="?/deleteTag" use:enhance={runDelete}>
    <input type="hidden" name="id" value={editingTag.id} />
    <div class="col-xs-12">
      <Stack>
        <div class="alert alert-danger alert-slim" style="align-self: flex-start">
          <FlowItems tighter={true}><span>Delete {originalName}?</span></FlowItems>
        </div>
        <FlowItems>
          <Button disabled={deleting} preset="danger-xs">
            {#if deleting}
              <span> Deleting <i class="far fa-spinner fa-spin" /></span>
            {:else}
              <span>Delete it!</span>
            {/if}
          </Button>
          <Button disabled={deleting} onClick={() => (deleteShowing = false)} class="btn btn-xs">Cancel</Button>
        </FlowItems>
      </Stack>
    </div>
  </form>
{/if}
