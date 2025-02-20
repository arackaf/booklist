<script lang="ts">
  import { page } from "$app/stores";
  import type { Book } from "$data/types";

  import MobileViewItem from "./MobileViewItem.svelte";
  import BookDetailsModal from "./BookDetailsModal.svelte";

  type Props = {
    isPublic: boolean;
    books: Book[];
  };

  let { isPublic, books }: Props = $props();
  let { subjects, tags } = $derived($page.data);

  let previewing = $state(false);
  let bookPreviewing = $state<Book | null>(null);

  const previewBook = (book: Book) => {
    previewing = true;
    bookPreviewing = book;
  };
</script>

<BookDetailsModal isOpen={previewing} onHide={() => (previewing = false)} viewingBook={bookPreviewing} {subjects} {tags} {isPublic} />

<div>
  <div class="pt-2 pb-4">
    <div style="border: 0">
      {#each books as book (book.id)}
        <MobileViewItem {book} {previewBook} />
      {/each}
    </div>
  </div>
</div>
