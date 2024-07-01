<script lang="ts">
  import EditBookInfo from "$lib/components/editBook/EditBookInfo.svelte";

  let editingBook: any = null;
</script>

{#if editingBook}
  <EditBookInfo book={editingBook} />
{/if}
