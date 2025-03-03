<script lang="ts">
  import type { Color, Tag } from "$data/types";
  import Button from "$lib/components/ui/button/button.svelte";
  import EditTag from "$lib/components/subjectsAndTags/tags/EditTag.svelte";
  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";

  type Props = {
    colors: Color[];
    tags: Tag[];
  };

  let { colors, tags }: Props = $props();

  let editingTag = $state<Tag | null>(null);
  let deleteShowing = $state(false);

  const createNewTag = () => ({
    id: 0,
    name: "",
    backgroundColor: "#847E71",
    textColor: "#ffffff"
  });

  const cancelEdit = () => (editingTag = null);
  const newTag = () => (editingTag = createNewTag());
  const editTag = (tag: Tag) => (editingTag = tag);
</script>

<div class="flex flex-col gap-3">
  {#if !deleteShowing}
    <div class="flex flex-col-reverse sm:flex-row gap-5">
      <SelectAvailableTags {tags} placeholder="Edit tag" currentlySelected={[]} onSelect={item => editTag(item)} />

      <Button size="sm" variant="outline" class="sm:ml-auto flex flex-row gap-1 self-start items-center" onclick={newTag}>
        <span>New tag </span>
      </Button>
    </div>
  {/if}

  {#if editingTag}
    <EditTag {colors} bind:deleteShowing tag={editingTag} onComplete={cancelEdit} onCancelEdit={cancelEdit} />
  {/if}
</div>
