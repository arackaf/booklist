<script lang="ts">
  import cloneDeep from "lodash.clonedeep";

  import EditBook from "./EditBook.svelte";

  export let book: any;

  $: editingBook = book ? cloneDeep(book) : book;
</script>

<EditBook book={editingBook} />
