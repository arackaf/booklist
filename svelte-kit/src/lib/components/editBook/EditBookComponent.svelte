<script lang="ts">
  import EditBook from "./EditBook.svelte";

  export let book: any;

  $: editingBook = book;
</script>

<EditBook book={editingBook} />
