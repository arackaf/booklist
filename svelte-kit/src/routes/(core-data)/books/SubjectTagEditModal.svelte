<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import Modal from "$lib/components/Modal.svelte";

  import type { Color, Subject, Tag } from "$data/types";

  import SubjectEditModalContents from "./SubjectEditModalContents.svelte";
  import TagEditModalContents from "./TagEditModalContents.svelte";

  type Props = {
    isOpen: boolean;
    onHide: () => void;
    colors: Color[];
    tags: Tag[];
    subjects: Subject[];
  };

  let { isOpen = false, onHide = () => {}, colors, subjects, tags }: Props = $props();
</script>

<Modal {isOpen} {onHide} headerCaption="Edit Subjects & Tags">
  <Tabs.Root value="subjects">
    <Tabs.List class="w-full grid gap-2 grid-cols-2">
      <Tabs.Trigger value="subjects">Subjects</Tabs.Trigger>
      <Tabs.Trigger value="tags">Tags</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="subjects">
      <SubjectEditModalContents {colors} {subjects} />
    </Tabs.Content>
    <Tabs.Content value="tags">
      <TagEditModalContents {colors} {tags} />
    </Tabs.Content>
  </Tabs.Root>
</Modal>
