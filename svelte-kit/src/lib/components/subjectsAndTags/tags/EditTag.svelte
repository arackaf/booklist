<script lang="ts">
  import { onMount } from "svelte";

  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  import type { Color, Tag } from "$data/types";

  import Alert from "$lib/components/Alert.svelte";
  import ColorsPalette from "$lib/components/ColorsPalette.svelte";
  import CustomColorPicker from "$lib/components/CustomColorPicker.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import ActionButton from "$lib/components/Button/ActionButton.svelte";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import InputGroup from "$lib/components/form-elements/Input/InputGroup.svelte";
  import Label from "$lib/components/form-elements/Label/Label.svelte";

  type Props = {
    tag: Tag;
    colors: Color[];

    onCancelEdit: () => void;
    deleteShowing?: boolean;

    onComplete: () => void;
  };

  let { tag, colors, onCancelEdit, deleteShowing = $bindable(false), onComplete = () => {} }: Props = $props();

  const textColors = ["#ffffff", "#000000"];

  let missingName = $state(false);
  let inputEl = $state<HTMLInputElement>();

  let originalName = $state("");

  onMount(() => {
    inputEl?.focus({ preventScroll: true });

    return () => {
      deleteShowing = false;
    };
  });

  let editingTag = $state({ ...tag });

  $effect(() => {
    editingTagChanged(tag);
  });

  $effect(() => {
    if (editingTag.name) {
      missingName = false;
    }
  });

  function editingTagChanged(tag: Tag) {
    editingTag = { ...tag };
    missingName = false;
    deleteShowing = false;
    originalName = tag.name;
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

{#if !editingTag}
  <div></div>
{:else if !deleteShowing}
  <form method="POST" action="?/saveTag" use:enhance={runSave}>
    <input type="hidden" name="id" value={editingTag.id} />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
      <div class="md:col-span-2">
        <div class="flex flex-col gap-1">
          <InputGroup labelText="Name">
            <Input error={missingName} bind:inputEl bind:value={editingTag.name} name="name" placeholder="Tag name" />
          </InputGroup>

          {#if missingName}
            <Label theme="error" class="self-start">Tags need names!</Label>
          {/if}
          <Label colors={editingTag} style="max-width: 100%; overflow: hidden; align-self: flex-start;">
            {editingTag.name.trim() || "<label preview>"}
          </Label>
        </div>
      </div>

      <div>
        <div class="flex flex-col">
          <span class="text-sm">Label Color</span>
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
        <div class="flex flex-col">
          <span class="text-sm">Text Color</span>
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
        <div class="flex flex-row gap-2">
          <Button size="sm" theme="primary" disabled={saving}>Save</Button>
          <Button size="sm" disabled={saving} onclick={onCancelEdit}>Cancel</Button>
          {#if editingTag.id}
            <Button
              size="sm"
              theme="danger"
              type="button"
              disabled={saving}
              class="ml-auto flex flex-row gap-1"
              onclick={() => (deleteShowing = true)}
            >
              <span>Delete {originalName}</span>
              <i class="fal fa-fw fa-trash-alt"></i>
            </Button>
          {/if}
        </div>
      </div>
    </div>
  </form>
{:else}
  <form method="POST" action="?/deleteTag" use:enhance={runDelete}>
    <input type="hidden" name="id" value={editingTag.id} />

    <div class="flex flex-col gap-3">
      <Alert type="error" layout="slim">
        <div>
          <span>Delete {originalName}?</span>
        </div>
      </Alert>

      <div class="flex flex-row gap-4">
        <ActionButton size="sm" theme="danger" running={deleting}>Delete it!</ActionButton>
        <Button size="sm" disabled={deleting} onclick={() => (deleteShowing = false)}>Cancel</Button>
      </div>
    </div>
  </form>
{/if}
