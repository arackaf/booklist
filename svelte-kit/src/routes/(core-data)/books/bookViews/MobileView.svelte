<script lang="ts">
  import { page } from "$app/stores";
  import type { Book } from "$data/types";

  import MobileViewItem from "./MobileViewItem.svelte";
  import BookDetailsModal from "./BookDetailsModal.svelte";

  export let isPublic: boolean;
  export let books: Book[];
  $: ({ subjects, tags } = $page.data);

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
        <MobileViewItem {book} {previewBook} />
      {/each}
    </div>
  </div>
</div>
