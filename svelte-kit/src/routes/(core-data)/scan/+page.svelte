<script lang="ts">
  import type { Book } from "$data/types";

  import EditBookComponent from "$lib/components/editBook/EditBookComponent.svelte";

  export let data;

  $: ({ subjects: allSubjects, tags } = data);

  let editingBook: Book | null = null;
</script>

<section>
  <EditBookComponent book={editingBook} subjects={allSubjects} {tags} />
</section>
