<script lang="ts">
  import BookDetailsModal from "./BookDetailsModal.svelte";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import type { Book, Subject, Tag } from "$data/types";

  export let books: Book[];
  export let subjects: Subject[];
  export let tags: Tag[];
  export let isPublic: boolean;

  let previewing: boolean = false;
  let bookPreviewing: Book | null = null;

  const previewBook = (book: Book) => {
    previewing = true;
    bookPreviewing = book;
  };
</script>

<BookDetailsModal isOpen={previewing} onHide={() => (previewing = false)} viewingBook={bookPreviewing} {subjects} {tags} {isPublic} />

<div>
  <div class="root">
    <div style="border: 0" class="covers-list">
      {#each books as book}
        <figure on:click={() => previewBook(book)} on:keydown={() => {}}>
          <div>
            <BookCover size="medium" {book} />
          </div>
          <figcaption>{book.title}</figcaption>
        </figure>
      {/each}
    </div>
  </div>
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
  }

  .covers-list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    margin: -15px;
    max-width: 1200px;
  }
  figure {
    width: 120px;
    margin: 15px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    border: var(--default-border-width) solid var(--neutral-8);
    border-radius: 5px;
    padding: 5px;
    transition: transform 100ms ease-in, box-shadow 100ms ease-in;
  }

  figure:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 12px var(--neutral-7);
  }

  .covers-list :global(img) {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  figcaption {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: bold;
    color: var(--neutral-2);
    margin-top: auto;
    padding: 2px;
  }
</style>
