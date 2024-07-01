<script lang="ts">
  import type { Book } from "$data/types";

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
</script>

<section>
  <EditBookModal
    isOpen={enteringBook}
    book={editingBook}
    subjects={allSubjects}
    {tags}
    onSave={() => (editingBook = defaultEmptyBook())}
    onHide={() => (enteringBook = false)}
    header={"Enter book"}
  />
</section>
