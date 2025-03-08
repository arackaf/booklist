<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import * as Table from "$lib/components/ui/table";

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

<Table.Root data-style="position: relative; align-self: start;" data-class="table w-full max-w-full">
  <Table.Header>
    <Table.Row>
      {#if !isPublic}
        <Table.Head class="p-0 w-6 text-center">
          <button class="raw-button" style="font-size: 12pt" onclick={toggleCheckAll} aria-label="Select all">
            <i class={"fal fa-fw " + (!!allBooksSelected ? "fa-check-square" : "fa-square")}></i>
          </button>
        </Table.Head>
      {/if}
      <Table.Head class="p-0 w-[60px]"></Table.Head>
      <Table.Head class="p-0 min-w-52">
        <a href={changeFilter.withSort("title")}>
          Title
          {#if searchState.value.sortField == "title"}<i class={"far fa-angle-" + (searchState.value.sortDirection == "asc" ? "up" : "down")}
            ></i>{/if}
        </a>
      </Table.Head>
      <Table.Head class="min-w-20">Subjects</Table.Head>
      <Table.Head class="min-w-20">Tags</Table.Head>
      <Table.Head class="min-w-20"></Table.Head>
      <Table.Head></Table.Head>
      <Table.Head class="min-w-20">
        <a href={changeFilter.withSort("pages")}>
          Pages
          {#if searchState.value.sortField == "pages"}
            <i class={"far fa-angle-" + (searchState.value.sortDirection == "asc" ? "up" : "down")}></i>
          {/if}
        </a>
      </Table.Head>
      <Table.Head>
        <a href={changeFilter.withSort("id")}>
          Added
          {#if searchState.value.sortField == "id"}
            <i class={"far fa-angle-" + (searchState.value.sortDirection == "asc" ? "up" : "down")}></i>
          {/if}
        </a>
      </Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each books as book (book.id)}
      <BookRow {book} {subjects} {tags} {isPublic} {previewBook} />
    {/each}
  </Table.Body>
</Table.Root>
