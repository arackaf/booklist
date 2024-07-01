<script lang="ts">
  import EditBookComponent from "$lib/components/editBook/EditBookComponent.svelte";

  let editingBook: any = null;
</script>

<section>
  <EditBookComponent book={editingBook} />
</section>
