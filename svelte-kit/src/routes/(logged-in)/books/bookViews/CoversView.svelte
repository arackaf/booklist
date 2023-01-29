<script lang="ts">
  import CoversDetailView from "./CoversDetailView.svelte";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import type { Book, Subject, Tag } from "$data/types";

  export let books: Book[];
  export let subjects: Subject[];
  export let tags: Tag[];

  let previewing: boolean = false;
  let bookPreviewing: Book | null = null;

  const previewBook = (book: Book) => {
    previewing = true;
    bookPreviewing = book;
  };
</script>

<CoversDetailView isOpen={previewing} onHide={() => (previewing = false)} viewingBook={bookPreviewing} {subjects} {tags} />

<div>
  <div>
    <div style="border: 0" class="coversList">
      {#each books as book, i}
        <figure on:click={() => previewBook(book)} on:keydown={() => {}}>
          <div>
            <BookCover size="medium" url={book.mediumImage} preview={book.mediumImagePreview} />
          </div>
          <figcaption>{book.title}</figcaption>
        </figure>
      {/each}
    </div>
  </div>
</div>

<style>
  .coversList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  figure {
    width: 120px;
    margin: 15px 15px 0 0;
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

  .coversList :global(img) {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  figcaption {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: var(--neutral-2);
    margin-top: auto;
    padding: 2px;
  }
</style>
