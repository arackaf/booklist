<script lang="ts">
  import type { Book } from "$data/types";
  import Button from "$lib/components/Button/Button.svelte";
  import EditBook from "$lib/components/editBook/EditBook.svelte";

  import EditBookModal from "$lib/components/editBook/EditBookModal.svelte";

  export let data;

  $: ({ subjects: allSubjects, tags } = data);

  const defaultEmptyBook = () =>
    ({
      title: "",
      isbn: "",
      pages: "",
      publisher: "",
      publicationDate: "",
      authors: [""],
      tags: [],
      subjects: []
    }) as unknown as Book;

  let editingBook: Book | null = null;

  let enteringBook = false;

  const manuallyEnterBook = () => {
    editingBook = defaultEmptyBook();
    enteringBook = true;
  };
</script>

<section>
  <Button size="sm" class="ml-6" on:click={manuallyEnterBook}>Manual entry</Button>
  {#if editingBook}
    <EditBook book={editingBook} onCancel={() => (editingBook = null)} />
  {/if}
</section>
