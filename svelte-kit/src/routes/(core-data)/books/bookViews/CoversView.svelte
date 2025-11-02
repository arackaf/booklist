<script lang="ts">
  import { page } from "$app/stores";
  import type { Book } from "$data/types";
  import BookDetailsModal from "./BookDetailsModal.svelte";
  import BookCover from "$lib/components/BookCover.svelte";

  type Props = {
    books: Book[];
    isPublic: boolean;
  };

  let { books, isPublic }: Props = $props();

  let { subjects, tags, isAdminUser } = $derived($page.data);

  let previewing = $state(false);
  let bookPreviewing = $state<Book | null>(null);

  const previewBook = (book: Book) => {
    previewing = true;
    bookPreviewing = book;
  };
</script>

<BookDetailsModal isOpen={previewing} onHide={() => (previewing = false)} viewingBook={bookPreviewing} {subjects} {tags} {isPublic} />

<div class="pt-2 mb-10">
  <div class="flex flex-col items-center mt-4">
    <div style="border: 0" class="flex gap-2 md:gap-3 lg:gap-4 justify-center flex-wrap m-[-15px] w-full max-w-7xl">
      {#each books as book}
        <button class="raw-button flex" onclick={() => previewBook(book)}>
          <figure
            class="w-[120px] flex flex-col self-stretch cursor-pointer border border-neutral-300 rounded p-[5px] transition-[transform_box-shadow] hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-300"
          >
            <div class="self-center">
              <BookCover imgClasses="max-w-full" size="medium" {book} />
            </div>
            <figcaption class="whitespace-nowrap overflow-hidden text-ellipsis text-xs font-bold mt-auto p-[2px]">
              {book.title}
            </figcaption>
          </figure>
        </button>
      {/each}
    </div>
  </div>
</div>
