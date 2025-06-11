<script lang="ts">
  import { ChevronDownIcon, ChevronUpIcon } from "lucide-svelte";

  import type { Book, Subject, Tag } from "$data/types";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";

  import BookRow from "./BookRow.svelte";
  import { ChangeFilters, SearchState } from "../state/searchState.svelte";
  import { selectionState } from "../state/selectionState.svelte";
  import BookDetailsModal from "./BookDetailsModal.svelte";

  type Props = {
    isPublic: boolean;
    books: Book[];
    subjects: Subject[];
    tags: Tag[];
  };
  let { isPublic, books, subjects, tags }: Props = $props();

  const searchState = new SearchState();

  const changeFilter = new ChangeFilters();
  let previewing = $state(false);
  let bookPreviewing = $state<Book | null>(null);

  let allBooksSelected = $derived(books.length === selectionState.selectedBooks.length);

  function checkAll(val: boolean) {
    if (val) {
      selectionState.selectAll(books);
    } else {
      selectionState.clear();
    }
  }

  const previewBook = (book: Book) => {
    previewing = true;
    bookPreviewing = book;
  };
</script>

<BookDetailsModal isOpen={previewing} onHide={() => (previewing = false)} viewingBook={bookPreviewing} {subjects} {tags} {isPublic} />

<table style="position: relative; align-self: start;" class="table w-full max-w-full">
  <thead>
    <tr>
      {#if !isPublic}
        <th class="p-0 w-6 justify-items-center">
          <Checkbox bind:checked={() => !!allBooksSelected, val => checkAll(val)} />
        </th>
      {/if}
      <th class="p-0 w-[60px]"></th>
      <th class="p-0 min-w-48">
        <a class="flex gap-1 justify-self-start" href={changeFilter.withSort("title")}>
          Title
          {#if searchState.value.sortField == "title"}
            {#if searchState.value.sortDirection == "asc"}
              <ChevronUpIcon />
            {:else}
              <ChevronDownIcon />
            {/if}
          {/if}
        </a>
      </th>
      <th class="p-0 min-w-32">Subjects & Tags</th>
      <th class="p-0 min-w-20"></th>
      <th class="p-0"></th>
      <th class="p-0 min-w-20">
        <a class="flex gap-1 justify-self-start" href={changeFilter.withSort("pages")}>
          Pages
          {#if searchState.value.sortField == "pages"}
            {#if searchState.value.sortDirection == "asc"}
              <ChevronUpIcon />
            {:else}
              <ChevronDownIcon />
            {/if}
          {/if}
        </a>
      </th>
      <th class="p-0">
        <a class="flex gap-1 justify-self-start" href={changeFilter.withSort("added")}>
          Added
          {#if searchState.value.sortField == "added"}
            {#if searchState.value.sortDirection == "asc"}
              <ChevronUpIcon />
            {:else}
              <ChevronDownIcon />
            {/if}
          {/if}
        </a>
      </th>
    </tr>
  </thead>
  <tbody>
    {#each books as book (book.id)}
      <BookRow {book} {subjects} {tags} {isPublic} {previewBook} />
    {/each}
  </tbody>
</table>
