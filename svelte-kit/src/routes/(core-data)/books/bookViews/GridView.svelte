<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";
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

  function toggleCheckAll() {
    if (allBooksSelected) {
      selectionState.clear();
    } else {
      selectionState.selectAll(books);
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
        <th class="p-0" style="text-align: center; width: 25px;">
          <button class="raw-button" style="font-size: 12pt" onclick={toggleCheckAll} aria-label="Select all">
            <i class={"fal fa-fw " + (!!allBooksSelected ? "fa-check-square" : "fa-square")}></i>
          </button>
        </th>
      {/if}
      <th class="p-0" style="width: 60px"></th>
      <th class="p-0" style="min-width: 200px">
        <a class="bold" href={changeFilter.withSort("title")}>
          Title
          {#if searchState.value.sortField == "title"}<i class={"far fa-angle-" + (searchState.value.sortDirection == "asc" ? "up" : "down")}
            ></i>{/if}
        </a>
      </th>
      <th class="p-0" style="min-width: 90px;">Subjects</th>
      <th class="p-0" style="min-width: 90px;">Tags</th>
      <th class="p-0" style="min-width: 90px;"></th>
      <th class="p-0"></th>
      <th class="p-0" style="min-width: 85px; ">
        <a class="bold" href={changeFilter.withSort("pages")}>
          Pages
          {#if searchState.value.sortField == "pages"}<i class={"far fa-angle-" + (searchState.value.sortDirection == "asc" ? "up" : "down")}
            ></i>{/if}
        </a>
      </th>
      <th class="p-0">
        <a class="bold" href={changeFilter.withSort("id")}>
          Added
          {#if searchState.value.sortField == "id"}<i class={"far fa-angle-" + (searchState.value.sortDirection == "asc" ? "up" : "down")}></i>{/if}
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
