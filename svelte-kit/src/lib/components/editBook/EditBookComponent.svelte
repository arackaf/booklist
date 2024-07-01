<script lang="ts">
  import cloneDeep from "lodash.clonedeep";

  import type { Subject, Tag } from "$data/types";

  import EditBook from "./EditBook.svelte";

  export let book: any;

  export let tags: Tag[];
  export let subjects: Subject[];

  $: editingBook = book ? cloneDeep(book) : book;
</script>

<EditBook book={editingBook} {subjects} {tags} />
