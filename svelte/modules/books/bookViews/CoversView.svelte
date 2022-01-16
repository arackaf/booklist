<script lang="ts">
  import { getContext } from "svelte";
  import { Readable } from "svelte/store";

  import CoverMedium from "app/components/bookCovers/CoverMedium.svelte";
  import CoversDetailView from "./CoversDetailView.svelte";

  export let booksState: Readable<{ books: any[]; currentQuery: string }>;
  $: ({ books } = $booksState);

  let bookPreviewing = null;

  const previewBook = book => {
    bookPreviewing = book;
  };
</script>

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

  @media (max-width: 600px) {
    figure {
      width: 70px;
      margin: 7px 10px 0 0;
    }
    :global(figure.no-cover-medium) {
      width: 70px;
      font-size: var(--no-cover-small-font-size);
      padding-top: var(--no-cover-small-padding-top);
      max-height: 90px;
    }
  }
  @media (max-width: 420px) {
    figure {
      width: 50px;
      margin: 5px 5px 0 0;
    }
    :global(figure.no-cover-medium) {
      width: var(--no-cover-small-width);
      max-height: var(--no-cover-small-height);
    }
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

{#if bookPreviewing}
  <CoversDetailView isOpen={bookPreviewing} onHide={() => (bookPreviewing = null)} book={bookPreviewing} />
{/if}

<div>
  <div>
    <div style="border: 0" class="coversList">
      {#each books as book, i}
        <figure on:click={() => previewBook(book)}>
          <div>
            <CoverMedium url={book.mediumImage} />
          </div>
          <figcaption>{book.title}</figcaption>
        </figure>
      {/each}
    </div>
  </div>
</div>
