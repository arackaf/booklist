<script lang="ts">
  import cloneDeep from "lodash.clonedeep";

  import type { Book, Subject, Tag } from "$data/types";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import EditBook from "./EditBook.svelte";

  import Modal from "../Modal.svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide: any;
  export let tags: Tag[];
  export let subjects: Subject[];
  export let header: string;

  $: editingBook = book ? cloneDeep(book) : book;
</script>

<Modal headerCaption={header} {isOpen} {onHide} standardFooter={false}>
  <EditBook book={editingBook} {subjects} {tags} />
</Modal>
