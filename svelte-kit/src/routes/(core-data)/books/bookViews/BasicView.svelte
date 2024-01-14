<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import BasicViewItem from "./BasicViewItem.svelte";
  import BookDetailsModal from "./BookDetailsModal.svelte";

  export let isPublic: boolean;
  export let books: Book[];
  export let tags: Tag[];
  export let subjects: Subject[];

  let previewing: boolean = false;
  let bookPreviewing: Book | null = null;

  const previewBook = (book: Book) => {
    previewing = true;
    bookPreviewing = book;
  };
</script>

<BookDetailsModal isOpen={previewing} onHide={() => (previewing = false)} viewingBook={bookPreviewing} {subjects} {tags} {isPublic} />

<div>
  <div style="padding-bottom: 15px">
    <div style="border: 0">
      {#each books as book (book.id)}
        <BasicViewItem {book} {previewBook} />
      {/each}
    </div>
  </div>
</div>
