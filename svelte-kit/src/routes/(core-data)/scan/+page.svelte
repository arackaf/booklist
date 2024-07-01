<script lang="ts">
  import type { Book } from "$data/types";

  import EditBookComponent from "$lib/components/editBook/EditBookComponent.svelte";

  let editingBook: Book | null = null;
</script>

<section>
  <EditBookComponent book={editingBook} />
</section>
