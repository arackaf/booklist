<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";

  import type { Color, Tag } from "$data/types";
  import TagEditModalContents from "./TagEditModalContents.svelte";

  export let isOpen = false;
  export let onHide = () => {};

  export let colors: Color[];
  export let tags: Tag[];
</script>

<Modal {isOpen} {onHide} headerCaption="Edit Tags">
  <TagEditModalContents {colors} {tags} />
</Modal>
