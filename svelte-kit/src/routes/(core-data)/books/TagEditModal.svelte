<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import type { Color, Tag } from "$data/types";
  import TagEditModalContents from "./TagEditModalContents.svelte";

  type Props = {
    isOpen: boolean;
    onHide: () => void;
    colors: Color[];
    tags: Tag[];
  };

  let { isOpen = false, onHide = () => {}, colors, tags }: Props = $props();
</script>

<Modal {isOpen} {onHide} headerCaption="Edit Tags">
  <TagEditModalContents {colors} {tags} />
</Modal>
